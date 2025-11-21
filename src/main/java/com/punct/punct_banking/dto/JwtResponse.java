package com.punct.punct_banking.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    
    private String token;
    private String id;
    private String username;
    private String email;
    private String phoneNumber;
    private String address;
    private List<String> roles;

}
