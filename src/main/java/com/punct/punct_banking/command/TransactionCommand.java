package com.punct.punct_banking.command;

import com.punct.punct_banking.service.AccountService;

import java.math.BigDecimal;

public class TransactionCommand implements BankCommand {
    private final AccountService accountService;
    private final String username;
    private final String fromIban;
    private final String toIban;
    private final BigDecimal amount;

    public TransactionCommand(AccountService accountService, String username, String fromIban, String toIban, BigDecimal amount) {
        this.accountService = accountService;
        this.username = username;
        this.fromIban = fromIban;
        this.toIban = toIban;
        this.amount = amount;
    }

    @Override
    public void execute() {
        accountService.initiateTransfer(username, fromIban, toIban, amount);
    }
}
