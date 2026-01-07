package com.punct.punct_banking.controller;

import com.punct.punct_banking.dto.NotificationDto;
import com.punct.punct_banking.repository.UserRepository;
import com.punct.punct_banking.service.NotificationReadService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;


//API pentru frontend

@RestController
@RequestMapping("/api/notifications") //toate rutele din clasa incep cu prefixu ala
public class NotificationController {

    //dependinte injectate
    private final NotificationReadService notificationReadService;
    private final UserRepository userRepo;

    public NotificationController(NotificationReadService notificationReadService, UserRepository userRepo) {
        this.notificationReadService = notificationReadService;
        this.userRepo = userRepo;
    }

    private String currentUserId(Authentication auth) {
        String username = auth.getName(); //username
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication user"))
                .getId();
    }


    //lista de notificari
    @GetMapping
    public ResponseEntity<List<NotificationDto>> getMyNotifications(Authentication auth) {
        String userId = currentUserId(auth);
        return ResponseEntity.ok(notificationReadService.getMyNotifications(userId));

    }


    //returneaza json simplu {"count": nr}
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(Authentication auth) {
        String userId = currentUserId(auth);
        long count = notificationReadService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    //mark one as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, Long>> markAsRead(@PathVariable Long id, Authentication auth) {
        String userId = currentUserId(auth);
        notificationReadService.markAsRead(userId, id);
        long count = notificationReadService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    //mark all as read (notificarile de la user devin read = true)
    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, Long>> markAllAsRead(Authentication auth) {
        String userId = currentUserId(auth);
        notificationReadService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("count", 0L));
    }
}
