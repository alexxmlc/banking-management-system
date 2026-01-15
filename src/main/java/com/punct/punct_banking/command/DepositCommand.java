package com.punct.punct_banking.command;

import com.punct.punct_banking.service.AccountService;

import java.math.BigDecimal;

public class DepositCommand implements BankCommand {
    private final AccountService accountService;
    private final String username;
    private final String iban;
    private final BigDecimal amount;

    public DepositCommand(AccountService accountService, String username, String iban, BigDecimal amount) {
        this.accountService = accountService;
        this.username = username;
        this.iban = iban;
        this.amount = amount;
    }

    @Override
    public void execute() {
        accountService.depositFunds(username, iban, amount);
    }
}
