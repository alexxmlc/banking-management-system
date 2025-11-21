package com.punct.punct_banking.controller;

import com.punct.punct_banking.models.entity.Account;
import com.punct.punct_banking.service.AccountService;
import com.punct.punct_banking.models.entity.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/accounts")
@CrossOrigin(origins = "http://localhost:5173/")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @PostMapping
    public Account createAccount(@RequestBody Map<String, String> request, Principal principal) {
        // `principal` holds information about user from JWT
        String currency = request.get("currency");
        return accountService.createAccount(principal.getName(), currency);
    }

    @GetMapping("/me")
    public List<Account> getMyAccounts(Principal principal) {
        return accountService.getMyAccounts(principal.getName());
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transferMoney(@RequestBody Map<String, Object> request, Principal principal) {
        try {
            String fromIban = (String) request.get("fromIban");
            String toIban = (String) request.get("toIban");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());

            accountService.transferFunds(principal.getName(), fromIban, toIban, amount);
            return ResponseEntity.ok("Transfer successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{iban}/transactions")
    public List<Transaction> getHistory(@PathVariable String iban, Principal principal) {
        return accountService.geTransactionHistory(principal.getName(), iban);
    }
}
