package com.punct.punct_banking.service;

import com.punct.punct_banking.models.entity.Account;
import com.punct.punct_banking.models.entity.CashTransaction;
import com.punct.punct_banking.models.entity.Transaction;
import com.punct.punct_banking.models.entity.User;
import com.punct.punct_banking.models.enums.CashTransactionType;
import com.punct.punct_banking.models.enums.TransactionStatus;
import com.punct.punct_banking.repository.AccountRepository;
import com.punct.punct_banking.repository.CashTransactionRepository;
import com.punct.punct_banking.repository.TransactionRepository;
import com.punct.punct_banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private CashTransactionRepository cashTransactionRepository;

    @Transactional
    public void initiateTransfer(String username, String fromIban, String toIban, BigDecimal amount) {
        if (fromIban.equals(toIban)) {
            throw new RuntimeException("Cannot transfer funds to the same account");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount has to be positive");
        }
        Account sourceAccount = accountRepository.findAccountByIban(fromIban).orElseThrow(() -> new RuntimeException("Source account not found"));
        if (!sourceAccount.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You do not own the account");
        }
        Account targetAccount = accountRepository.findAccountByIban(toIban).orElseThrow(() -> new RuntimeException("Target account not found"));
        if (sourceAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(amount));
        accountRepository.save(sourceAccount);

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setSourceIban(fromIban);
        transaction.setTargetIban(toIban);
        transaction.setDescription("Funds: [" + amount + "] received from " + username);
        transaction.setTimestamp(LocalDateTime.now());

        if (sourceAccount.getUser().getId().equals(targetAccount.getUser().getId())) {
            targetAccount.setBalance(targetAccount.getBalance().add(amount));
            accountRepository.save(targetAccount);
            transaction.setStatus(TransactionStatus.COMPLETED);
        } else {
            transaction.setStatus(TransactionStatus.PENDING);
        }

        transactionRepository.save(transaction);
    }

    @Transactional
    public void acceptTransfer(String username, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new RuntimeException("Transaction is not PENDING");
        }
        Account targetAccount = accountRepository.findAccountByIban(transaction.getTargetIban()).orElseThrow(() -> new RuntimeException("Target account not found"));

        checkPermission(username, targetAccount);

        targetAccount.setBalance(targetAccount.getBalance().add(transaction.getAmount()));
        accountRepository.save(targetAccount);

        transaction.setStatus(TransactionStatus.COMPLETED);
        transactionRepository.save(transaction);
    }

    @Transactional
    public void rejectTransfer(String username, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new RuntimeException("Transaction is not PENDING");
        }
        Account targetAccount = accountRepository.findAccountByIban(transaction.getTargetIban()).orElseThrow(() -> new RuntimeException("Target account not found"));

        checkPermission(username, targetAccount);

        Account sourceAccount = accountRepository.findAccountByIban(transaction.getSourceIban()).orElseThrow(() -> new RuntimeException("Source account not found"));
        sourceAccount.setBalance(sourceAccount.getBalance().add(transaction.getAmount()));
        accountRepository.save(sourceAccount);

        transaction.setStatus(TransactionStatus.REJECTED);
        transactionRepository.save(transaction);
    }

    public void checkPermission(String username, Account targetAccount) {
        User currentUser = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        boolean isOwner = targetAccount.getUser().getUsername().equals(username);
        boolean isAdmin = currentUser.getRoles().contains("ROLE_ADMIN");

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You do not have permission to manage this transfer");
        }
    }

    public List<Transaction> getPendingIncomingTransfers(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        List<Transaction> allPending = new ArrayList<>();

        for (Account acc : user.getAccounts()) {
            allPending.addAll(transactionRepository.findByTargetIbanAndStatus(acc.getIban(), TransactionStatus.PENDING));
        }
        return allPending;
    }

    public List<Transaction> getTransactionHistory(String username, String iban) {
        Account account = accountRepository.findAccountByIban(iban).orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Access denied");
        }

        return transactionRepository.findHistory(iban);
    }

    public Account createAccount(String username, String currency) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        Account account = new Account();
        account.setUser(user);
        account.setCurrency(currency); // TODO: check if currency is in accepted list
        account.setBalance(BigDecimal.ZERO);
        account.setIban(generateIban()); // generate a random iban for now

        return accountRepository.save(account);
    }

    public List<Account> getMyAccounts(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUser(user);
    }

    @Transactional
    public void depositFunds(String username, String iban, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }
        Account account = accountRepository.findAccountByIban(iban)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        checkPermission(username, account);
        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        CashTransaction deposit = new CashTransaction();
        deposit.setType(CashTransactionType.DEPOSIT);
        deposit.setAmount(amount);
        deposit.setIban(iban);
        deposit.setDescription("Deposited " + amount + " in account " + iban);
        deposit.setTimestamp(LocalDateTime.now());
        cashTransactionRepository.save(deposit);
    }

    @Transactional
    public void withdrawFunds(String username, String iban, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }
        Account account = accountRepository.findAccountByIban(iban)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        checkPermission(username, account);
        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }
        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        CashTransaction withdrawal = new CashTransaction();
        withdrawal.setIban(iban);
        withdrawal.setType(CashTransactionType.WITHDRAWAL);
        withdrawal.setAmount(amount);
        withdrawal.setDescription("Withdrawn " + amount + " from account " + iban);
        withdrawal.setTimestamp(LocalDateTime.now());
        cashTransactionRepository.save(withdrawal);
     }

    // dummy implementation; change later... maybe... probably not
    private String generateIban() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder("RO");
        for (int i = 0; i < 10; i++) {
            sb.append(random.nextInt(10));
        }

        return sb.toString();
    }


}
