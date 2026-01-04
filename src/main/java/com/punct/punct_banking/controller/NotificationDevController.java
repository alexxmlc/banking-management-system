package com.punct.punct_banking.controller;

import com.punct.punct_banking.models.enums.NotificationType;
import com.punct.punct_banking.notifications.NotificationPublisher;
import com.punct.punct_banking.notifications.events.NotificationEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dev/notifications")
@Profile("dev") // IMPORTANT
public class NotificationDevController {

    private final NotificationPublisher notificationPublisher;

    public NotificationDevController(NotificationPublisher notificationPublisher) {
        this.notificationPublisher = notificationPublisher;
    }

    @PostMapping("/send")
    public void sendTestNotification(
            @RequestParam String userId
    ) {
        notificationPublisher.publish(
                new NotificationEvent(
                        userId,
                        NotificationType.TEST,
                        "Test notification",
                        "Hello from Postman 👋"
                )
        );
    }
}
