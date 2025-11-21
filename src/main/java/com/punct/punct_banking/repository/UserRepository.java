package com.punct.punct_banking.repository;

import java.util.Optional;

import com.punct.punct_banking.models.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String>{
    
    Optional<User> findByUsername(String username);
}