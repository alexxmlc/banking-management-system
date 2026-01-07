package com.punct.punct_banking.notifications.events;

//datele necesare unei notificari

import com.punct.punct_banking.models.enums.NotificationType;

public record NotificationEvent(
   String userId,
   NotificationType type,
   String title,
   String message
) {}
