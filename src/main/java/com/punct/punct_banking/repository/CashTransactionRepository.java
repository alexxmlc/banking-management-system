package com.punct.punct_banking.repository;

import com.punct.punct_banking.models.entity.CashTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CashTransactionRepository extends JpaRepository<CashTransaction, Long> {
    List<CashTransaction> findByIbanOrderByTimestampDesc(String iban);
}
