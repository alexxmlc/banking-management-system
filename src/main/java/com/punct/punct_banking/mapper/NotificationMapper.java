package com.punct.punct_banking.mapper;

import com.punct.punct_banking.dto.NotificationDto;
import com.punct.punct_banking.models.entity.Notification;

public class NotificationMapper {

    private NotificationMapper() {}

    public static NotificationDto toDto(Notification n) {
        return new NotificationDto(
                n.getId(),
                n.getType().name(),
                n.getTitle(),
                n.getMessage(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
