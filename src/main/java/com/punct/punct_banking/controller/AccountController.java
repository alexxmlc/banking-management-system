package com.punct.punct_banking.controller;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.punct.punct_banking.models.entity.Account;
import com.punct.punct_banking.models.entity.Transaction;
import com.punct.punct_banking.service.AccountService;

@RestController
@RequestMapping("/accounts")
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

            accountService.initiateTransfer(principal.getName(), fromIban, toIban, amount);
            return ResponseEntity.ok("Transfer initiated. Waiting for confirmation.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/deposit")
    public ResponseEntity<String> depositFunds(@RequestBody Map<String, Object> request, Principal principal) {
        try {
            String iban = request.get("iban").toString();
            BigDecimal amount = new BigDecimal(request.get("amount").toString());

            accountService.depositFunds(principal.getName(), iban, amount);
            return ResponseEntity.ok("Deposit successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdrawFunds(@RequestBody Map<String, Object> request, Principal principal) {
        try {
            String iban = request.get("iban").toString();
            BigDecimal amount = new BigDecimal(request.get("amount").toString());

            accountService.withdrawFunds(principal.getName(), iban, amount);
            return ResponseEntity.ok("Withdrawal successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/transfer/me")
    public List<Transaction> getIncomingTransfers(Principal principal) {
        return accountService.getPendingIncomingTransfers(principal.getName());
    }

    @PostMapping("/transfer/{id}/accept")
    public ResponseEntity<String> acceptIncomingTransfer(@RequestBody Long transactionId, Principal principal) {
        try {
            accountService.acceptTransfer(principal.getName(), transactionId);
            return ResponseEntity.ok("Transfer accepted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/transfer/{id}/reject")
    public ResponseEntity<String> rejectIncomingTransfer(@RequestBody Long transactionId, Principal principal) {
        try {
            accountService.rejectTransfer(principal.getName(), transactionId);
            return ResponseEntity.ok("Transfer rejected. Funds returned to sender");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{iban}/transactions")
    public List<Transaction> getHistory(@PathVariable String iban, Principal principal) {
        return accountService.getTransactionHistory(principal.getName(), iban);
    }
}
