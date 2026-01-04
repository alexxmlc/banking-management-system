package com.punct.punct_banking.service;

import com.punct.punct_banking.models.enums.NotificationType;
import com.punct.punct_banking.notifications.NotificationPublisher;
import com.punct.punct_banking.notifications.events.NotificationEvent;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

//logica de business
@Service
public class NotificationService {

    private final NotificationPublisher publisher;

    public NotificationService(NotificationPublisher publisher) {
        this.publisher = publisher;
    }

    public void notifyUser(String userId, NotificationType type, String title, String message){
        publisher.publish(new NotificationEvent(userId, type, title, message));
    }

    public void notifyTransferSuccess(String userId, BigDecimal amount){
        notifyUser(
                userId,
                NotificationType.TRANSFER_SUCCESS,
                "Successful Transfer",
                "You transferred " + amount.stripTrailingZeros().toPlainString()
        );
    }

    public void notifyWithdrawalSuccess(String userId, BigDecimal amount){
        notifyUser(
          userId,
          NotificationType.WITHDRAWAL_SUCCESS,
          "Withdrawal completed",
          "A withdrawal of " + amount.stripTrailingZeros().toPlainString() + " was made from your account."
        );
    }

    public void notifyTransferRequest(String receiverUserId, String requesterName, BigDecimal amount){
        notifyUser(
                receiverUserId,
                NotificationType.TRANSFER_REQUEST,
                "Transfer request",
                requesterName + " requested " + amount.stripTrailingZeros().toPlainString() + " from you."

        );
    }

    public void notifyDepositSuccess(String userId, BigDecimal amount){
        notifyUser(
                userId,
                NotificationType.DEPOSIT_SUCCESS,
                "Deposit completed",
                "A deposit of " + amount.stripTrailingZeros().toPlainString() + " was added to your account."
        );
    }
}
