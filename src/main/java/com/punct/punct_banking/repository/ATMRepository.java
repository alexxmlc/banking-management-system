package com.punct.punct_banking.repository;

import com.punct.punct_banking.models.entity.ATM;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ATMRepository extends JpaRepository<ATM, Long> {
}
