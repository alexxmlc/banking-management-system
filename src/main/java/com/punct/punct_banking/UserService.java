package com.punct.punct_banking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user){
        
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
        }else{
            throw new UsernameNotFoundException("User not found: " + username);
        }

    }
}