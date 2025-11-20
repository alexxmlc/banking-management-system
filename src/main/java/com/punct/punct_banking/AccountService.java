package com.punct.punct_banking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

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
