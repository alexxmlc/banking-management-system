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
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // 1. First authenticate username + password
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }

        // 2. Find the user
        Optional<User> optionalUser = userRepository.findByUsername(loginRequest.getUsername());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        }

        User user = optionalUser.get();

        // 3. If 2FA is enabled, verify the code
        if (user.getSecret() != null) {

            if (loginRequest.getCode() == null || loginRequest.getCode().isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("2FA code required");
            }

            if (!codeVerifier.isValidCode(user.getSecret(), loginRequest.getCode())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid 2FA code");
            }
        }

        // 4. Generate token
        String token = jwtUtils.generateJwtToken(authentication);

        // 5. Build response DTO
        JwtResponse jwtResponse = new JwtResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddress(),
                List.of(user.getRoles().split(",")));

        return ResponseEntity.ok(jwtResponse);
    }

}
