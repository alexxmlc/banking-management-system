package com.punct.punct_banking;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PunctBankingApplication {

    public static void main(String[] args) {
        SpringApplication.run(PunctBankingApplication.class, args);
    }

    @Bean
    public CommandLineRunner printSwaggerUrl() {
        return args -> {
            System.out.println("\n----------------------------------------------------------");
            System.out.println("API Documentation: http://localhost:8081/swagger-ui/index.html");
            System.out.println("----------------------------------------------------------\n");
        };
    }

}
