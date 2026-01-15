package com.punct.punct_banking.command;

import com.punct.punct_banking.service.AccountService;

import java.math.BigDecimal;

public class WithdrawCommand implements BankCommand {
    private final AccountService accountService;
    private final String username;
    private final String iban;
    private final BigDecimal amount;

    public WithdrawCommand(AccountService accountService, String username, String iban, BigDecimal amount) {
        this.accountService = accountService;
        this.username = username;
        this.iban = iban;
        this.amount = amount;
    }

    @Override
    public void execute() {
        accountService.withdrawFunds(username, iban, amount);
    }
}
