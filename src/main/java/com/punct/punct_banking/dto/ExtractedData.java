package com.punct.punct_banking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExtractedData {
    
    private String cnp;
    private String firstName;
    private String lastName;
    private String address;
}
