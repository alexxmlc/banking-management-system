package com.punct.punct_banking.dto;

import java.time.Instant;

public record NotificationDto(
        Long id,
        String type,
        String title,
        String message,
        boolean read,
        Instant createdAt) {
}
