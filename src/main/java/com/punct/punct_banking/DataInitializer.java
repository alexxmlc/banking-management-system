package com.punct.punct_banking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setId("9999999999999");
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("adminpass")); // Always encode!
            admin.setEmail("admin@punct.com");
            admin.setPhoneNumber("0000000000");
            admin.setAddress("Admin HQ");

            // Assign ADMIN role directly
            // Your SecurityConfig looks for "ROLE_ADMIN"
            admin.setRoles("ROLE_USER, ROLE_ADMIN");

            userRepository.save(admin);
            System.out.println("------------ DEVELOPMENT MODE ------------");
            System.out.println("Admin user created: username='admin', password='adminpass'");
            System.out.println("------------------------------------------");
        }
    }
}