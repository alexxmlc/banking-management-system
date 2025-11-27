package com.punct.punct_banking.util;

import com.punct.punct_banking.models.entity.ATM;
import com.punct.punct_banking.repository.ATMRepository;
import com.punct.punct_banking.repository.UserRepository;
import com.punct.punct_banking.models.entity.User;
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
    @Autowired
    private ATMRepository atmRepository;

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

            // Some Dummy ATMs
            if (atmRepository.count() == 0) {
                createATM("Floresti, Str. Principala", 46.7470, 23.4900);
                createATM("Cluj-Napoca Centru", 46.7712, 23.6236);
                createATM("Iulius Mall", 46.7704, 23.6322);
            }
        }
    }

    private void createATM(String name, Double latitude, Double longitude) {
        ATM atm = new ATM();
        atm.setName(name);
        atm.setLatitude(latitude);
        atm.setLongitude(longitude);
        atmRepository.save(atm);
    }
}