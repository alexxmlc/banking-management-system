package com.punct.punct_banking.controller;

import java.util.List;
import java.util.Optional;

import com.punct.punct_banking.JwtUtils;
import com.punct.punct_banking.models.entity.User;
import com.punct.punct_banking.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.punct.punct_banking.dto.JwtResponse;
import com.punct.punct_banking.dto.LoginRequest;

import dev.samstevens.totp.code.CodeVerifier;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CodeVerifier codeVerifier;

    /**
     * Authenticates a user and returns a JWT Token.
     * * Frontend Protocol:
     * 1. Try sending just { username, password }.
     * 2. If response is 200 OK: Login successful, store the token.
     * 3. If response is 401 Unauthorized:
     * - It could be a wrong password.
     * - OR it could be that 2FA is required but the code was missing/wrong.
     * - UI Strategy: Show "Invalid credentials OR 2FA Code required".
     * * 4. To login with 2FA: Send { username, password, code }.
     */
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            // The input comes in as loginRequest
            // Wrap it in an unauthorized token (UsernamePasswordAuthenticationToken)
            // Then send the unauthorized token to AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            Optional<User> optionalUser = userRepository.findByUsername(loginRequest.getUsername());

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();

                // Check if 2FA is enabled for this user
                if (user.getSecret() != null) {

                    // First, check if they even sent a code
                    if (loginRequest.getCode() == null || loginRequest.getCode().isEmpty()) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                    }

                    // Then, check if the code is valid
                    if (!codeVerifier.isValidCode(user.getSecret(), loginRequest.getCode())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                    }
                }
                // If the password from the DB matches with the one that the user entered in
                // login form
                // Authentication is now valid and we can generate a token for this user
                String token = jwtUtils.generateJwtToken(authentication);

                // Put the token and the user into a DTO
                JwtResponse jwtResponse = new JwtResponse(
                        token,
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhoneNumber(),
                        user.getAddress(),
                        List.of(user.getRoles().split(",")));

                // Send it back as JSON
                return ResponseEntity.ok(jwtResponse);

            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    }
}
