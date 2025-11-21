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
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import com.punct.punct_banking.dto.JwtResponse;
import com.punct.punct_banking.dto.LoginRequest;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173/")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            // The input comes in as loginRequest
            // Wrap it in an unauthorized token (UsernamePasswordAuthenticationToken)
            // Then send the unauthorized token to AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            // If the password from the DB matches with the one that the user entered in
            // login form
            // Authentication is now valid and we can generate a token for this user
            String token = jwtUtils.generateJwtToken(authentication);
            Optional<User> optionalUser = userRepository.findByUsername(loginRequest.getUsername());

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();

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
