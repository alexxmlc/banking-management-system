package com.punct.punct_banking.notifications.listeners;

import com.punct.punct_banking.models.entity.Notification;
import com.punct.punct_banking.models.entity.User;
import com.punct.punct_banking.notifications.events.NotificationEvent;
import com.punct.punct_banking.repository.NotificationRepository;
import com.punct.punct_banking.repository.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class InAppNotificationListener {

    private final NotificationRepository notificationRepo;
    private final UserRepository userRepo;

    public InAppNotificationListener(NotificationRepository notificationRepo, UserRepository userRepo) {
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
    }



    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void handle(NotificationEvent event){
        User user = userRepo.findById(event.userId()).orElseThrow(() -> new RuntimeException("User not found: " + event.userId()));

        Notification n = new Notification();
        n.setUser(user);
        n.setType(event.type());
        n.setTitle(event.title());
        n.setMessage(event.message());

        notificationRepo.save(n);
    }
}
