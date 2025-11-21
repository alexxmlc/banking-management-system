package com.punct.punct_banking.repository;

import com.punct.punct_banking.models.entity.User;
import com.punct.punct_banking.models.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByUser(User user); // Spring Data Jpa auto-generates the query for this

    Optional<Account> findAccountByIban(String iban);
}
