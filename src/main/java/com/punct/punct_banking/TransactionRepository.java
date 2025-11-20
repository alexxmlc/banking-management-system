package com.punct.punct_banking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("SELECT t FROM Transaction t WHERE t.sourceIban = :iban OR t.targetIban = :iban ORDER BY t.timestamp DESC")
    List<Transaction> findHistory(String iban);
}
