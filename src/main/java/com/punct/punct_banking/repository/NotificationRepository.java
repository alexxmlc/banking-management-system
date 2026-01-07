package com.punct.punct_banking.repository;

import com.punct.punct_banking.models.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUser_IdOrderByCreatedAtDesc(String userId);

    Optional<Notification> findByIdAndUser_Id(Long id, String userId);
}
