package com.punct.punct_banking;

import com.punct.punct_banking.models.entity.Notification;
import com.punct.punct_banking.models.entity.User;
import com.punct.punct_banking.notifications.NotificationPublisher;
import com.punct.punct_banking.notifications.events.NotificationEvent;
import com.punct.punct_banking.repository.NotificationRepository;
import com.punct.punct_banking.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.support.TransactionTemplate;
import static org.awaitility.Awaitility.await;
import static java.util.concurrent.TimeUnit.SECONDS;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class NotificationObserverIntegrationTest {

    @Autowired private NotificationPublisher notificationPublisher;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private UserRepository userRepository;

    @Autowired private TransactionTemplate transactionTemplate;

    @Test
    void whenEventPublished_thenNotificationIsSaved() {

        String cnp = "1234567890123";

        // 1) TOTUL (save user + publish event) se întâmplă într-o tranzacție
        // 2) La final, tranzacția face COMMIT -> declanșează AFTER_COMMIT listener-ul
        transactionTemplate.executeWithoutResult(status -> {
            User user = new User();
            user.setId(cnp);
            user.setUsername("testuser");
            user.setPassword("pass");
            user.setEmail("test@test.com");
            user.setPhoneNumber("0700000000");
            user.setAddress("Test Address");
            userRepository.save(user);

            notificationPublisher.publish(new NotificationEvent(
                    cnp,
                    "TEST",
                    "Test title",
                    "Observer works"
            ));
        });

        // aici tranzacția e COMMITTED, deci listener-ul AFTER_COMMIT ar fi trebuit să salveze notificarea
        await().atMost(2, SECONDS).untilAsserted(() -> {
            var notifications = notificationRepository.findByUser_IdOrderByCreatedAtDesc(cnp);
            assertThat(notifications).hasSize(1);
        });

        var notifications = notificationRepository.findByUser_IdOrderByCreatedAtDesc(cnp);

        Notification n = notifications.get(0);
        assertThat(n.getTitle()).isEqualTo("Test title");
        assertThat(n.getMessage()).isEqualTo("Observer works");
        assertThat(n.getType()).isEqualTo("TEST");
        assertThat(n.isRead()).isFalse();
    }
}
