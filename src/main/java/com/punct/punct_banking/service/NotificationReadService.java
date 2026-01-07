package com.punct.punct_banking.service;

import com.punct.punct_banking.dto.NotificationDto;
import com.punct.punct_banking.mapper.NotificationMapper;
import com.punct.punct_banking.models.entity.Notification;
import com.punct.punct_banking.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationReadService {

    private final NotificationRepository notificationRepo;

    public NotificationReadService(NotificationRepository notificationRepo) {
        this.notificationRepo = notificationRepo;
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getMyNotifications(String userId) {
        return notificationRepo.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String userId) {
        return notificationRepo.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(n -> !n.isRead())
                .count();
    }

    @Transactional
    public void markAsRead(String userId, Long notificationId) {
        Notification n = notificationRepo.findByIdAndUser_Id(notificationId, userId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!n.isRead()) {
            n.setRead(true);
            notificationRepo.save(n);
        }
    }

    @Transactional
    public void markAllAsRead(String userId) {
        List<Notification> list = notificationRepo.findByUser_IdOrderByCreatedAtDesc(userId);
        boolean changed = false;

        for (Notification n : list) {
            if (!n.isRead()) {
                n.setRead(true);
                changed = true;
            }
        }

        if (changed) {
            notificationRepo.saveAll(list);
        }
    }
}
