package com.punct.punct_banking.service;

import com.punct.punct_banking.models.entity.User;
import com.punct.punct_banking.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.secret.SecretGenerator;

import java.util.Optional;
import java.util.List;

import com.punct.punct_banking.dto.VerifyCodeRequest;

import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SecretGenerator secretGenerator;

    @Autowired
    private CodeVerifier codeVerifier;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {

        String plainPassword = user.getPassword();
        String hashedPassword = passwordEncoder.encode(plainPassword);

        user.setPassword(hashedPassword);
        user.setRoles("ROLE_USER");

        return userRepository.save(user);
    }

    public ResponseEntity<User> updateUser(String id, User userDetails) {

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();

            existingUser.setUsername(userDetails.getUsername());
            existingUser.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            existingUser.setEmail(userDetails.getEmail());
            existingUser.setAddress(userDetails.getAddress());
            existingUser.setPhoneNumber(userDetails.getPhoneNumber());

            userRepository.save(existingUser);
            return ResponseEntity.ok(existingUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<Void> deleteUser(String id) {

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public User promoteUser(String username) {

        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (!user.getRoles().contains("ROLE_ADMIN")) {
                String existingRoles = user.getRoles();
                existingRoles += ", ROLE_ADMIN";
                user.setRoles(existingRoles);
                userRepository.save(user);
            }
            return user;
        } else {
            throw new UsernameNotFoundException("User not found: " + username);
        }

    }

    public String generate2FASecret() {
        return secretGenerator.generate();
    }

    public QrData enable2FA(String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setSecret(generate2FASecret());
            userRepository.save(user);
            QrData qrData = new QrData.Builder()
                    .label(user.getEmail())
                    .secret(user.getSecret())
                    .issuer("Punct Bank")
                    .algorithm(HashingAlgorithm.SHA1)
                    .digits(6)
                    .period(30)
                    .build();
            return qrData;
        } else {
            throw new UsernameNotFoundException("User with id not found: " + userId);
        }
    }

    public boolean verify2FA(String userId, VerifyCodeRequest request) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            System.out.println("DEBUG: Verifying 2FA for User: " + user.getUsername());
            System.out.println("DEBUG: Secret in DB: " + user.getSecret());
            System.out.println("DEBUG: Code from Request: " + request.getCode());

            if (user.getSecret() == null) {
                System.out.println("DEBUG: Secret is NULL! Cannot verify.");
                return false;
            }

            if (request.getCode() == null) {
                System.out.println("DEBUG: Code is NULL! Check your JSON/DTO.");
                return false;
            }

            return codeVerifier.isValidCode(user.getSecret(), request.getCode());
        } else {
            throw new UsernameNotFoundException("User with id not found: " + userId);
        }
    }
}