package com.punct.punct_banking.controller;

import com.punct.punct_banking.models.entity.ATM;
import com.punct.punct_banking.repository.ATMRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/atms")
public class ATMController {
    @Autowired
    private ATMRepository atmRepository;

    @GetMapping
    private List<ATM> getAllAtms() {
        return atmRepository.findAll();
    }
}
