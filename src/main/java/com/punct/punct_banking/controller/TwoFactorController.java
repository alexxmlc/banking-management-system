//For frontend: this class uses the methods to generate
//a qr code that allows the user to connect to the
//authentication app

package com.punct.punct_banking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.punct.punct_banking.dto.VerifyCodeRequest;
import com.punct.punct_banking.service.UserService;

import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;

@RestController
@RequestMapping("/auth/2fa")
public class TwoFactorController {

    @Autowired
    private UserService userService;

    @Autowired
    private QrGenerator qrGenerator;

    /**
     * Generates a new 2FA Secret and returns a QR Code image.
     * * Frontend Protocol:
     * 1. Call this when the user clicks "Enable 2FA".
     * 2. IMPORTANT: This generates and saves a NEW secret key to the DB immediately.
     * 3. The response content-type is "image/png".
     * 4. Display the binary image to the user (e.g., create a Blob URL).
     * 5. Ask the user to scan it and enter the 6-digit code.
     * 6. Send that code to POST /auth/2fa/verify/{userId} to confirm.
     */
    // This method sets up 2fa and geterates the qr
    @GetMapping(path = "/setup/{userId}", produces = "image/png")
    public byte[] generateQrCode(@PathVariable String userId) {
        try {
            QrData qrData = userService.enable2FA(userId);
            return qrGenerator.generate(qrData);
        } catch (QrGenerationException ex) {
            throw new RuntimeException("Unable to generate QR code");
        }
    }

    /**
     * Verifies the TOTP code during the 2FA Setup phase.
     * * Frontend Protocol:
     * 1. Call this AFTER the user scans the QR code from /setup.
     * 2. Payload: Send JSON { "code": "123456" }.
     * 3. Response 200 OK: Code is valid. You may now tell the user 2FA is enabled.
     * 4. Response 400 Bad Request: Code is invalid. Ask user to try again.
     */
    // This method verifies if the input 6-digit code from the user
    // matches the authentication app code on the creation step
    @PostMapping("/verify/{userId}")
    public ResponseEntity<Boolean> verifyCode(@PathVariable String userId, @RequestBody VerifyCodeRequest request) {

        boolean isVerified = userService.verify2FA(userId, request);
        if (isVerified) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
