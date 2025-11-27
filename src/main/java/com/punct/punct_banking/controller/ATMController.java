package com.punct.punct_banking.controller;

import com.punct.punct_banking.models.entity.ATM;
import com.punct.punct_banking.repository.ATMRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/atms")
public class ATMController {
    @Autowired
    private ATMRepository atmRepository;

    @GetMapping
    public List<ATM> getAllAtms() {
        return atmRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<ATM> addATM(@RequestBody ATM atm) {
        ATM savedAtm = atmRepository.save(atm);
        return ResponseEntity.ok(savedAtm);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteATM(@PathVariable Long id) {
        try {
            if (!atmRepository.existsById(id)) {
                return ResponseEntity.badRequest().body("ATM not found with ID: " + id);
            }
            atmRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting ATM: " + e.getMessage());
        }
    }
}
