package com.punct.punct_banking.service;

import com.punct.punct_banking.models.entity.Account;
import com.punct.punct_banking.models.entity.Transaction;
import com.punct.punct_banking.models.entity.User;
import com.punct.punct_banking.repository.AccountRepository;
import com.punct.punct_banking.repository.TransactionRepository;
import com.punct.punct_banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    @Transactional
    public void transferFunds(String username, String fromIban, String toIban, BigDecimal amount) {
        if (fromIban.equals(toIban)) {
            throw new RuntimeException("Cannot transfer funds to the same account");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Transfer amount must be positive");
        }

        Account sourceAccount = accountRepository.findAccountByIban(fromIban)
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        if (!sourceAccount.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You do not own the source account");
        }

        Account targetAccount = accountRepository.findAccountByIban(toIban)
                .orElseThrow(() -> new RuntimeException("Target account not found"));

        if (sourceAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(amount));
        targetAccount.setBalance(targetAccount.getBalance().add(amount));

        accountRepository.save(sourceAccount);
        accountRepository.save(targetAccount);

        Transaction transaction = new Transaction();
        transaction.setSourceIban(fromIban);
        transaction.setTargetIban(toIban);
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setDescription("Transfer from " + username); // can and should be changed to in-app description written by user

        transactionRepository.save(transaction);
    }

    public List<Transaction> geTransactionHistory(String username, String iban) {
        Account account = accountRepository.findAccountByIban(iban)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Access denied");
        }

        return transactionRepository.findHistory(iban);
    }

    public Account createAccount(String username, String currency) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = new Account();
        account.setUser(user);
        account.setCurrency(currency); // TODO: check if currency is in accepted list
        account.setBalance(BigDecimal.ZERO);
        account.setIban(generateIban()); // generate a random iban for now

        return accountRepository.save(account);
    }

    public List<Account> getMyAccounts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUser(user);
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
