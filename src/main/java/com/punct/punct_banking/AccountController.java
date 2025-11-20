package com.punct.punct_banking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

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
}
