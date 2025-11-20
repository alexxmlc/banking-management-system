package com.punct.punct_banking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByUser(User user); // Spring Data Jpa auto-generates the query for this
}
