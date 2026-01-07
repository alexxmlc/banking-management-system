package com.punct.punct_banking.notifications;

import com.punct.punct_banking.notifications.events.NotificationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

//service care publica event-ul (event = notificare) (adica un publisher)
//locul unde se declanseaza notificarea
@Component
public class NotificationPublisher {

    private final ApplicationEventPublisher publisher;

    public NotificationPublisher(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    public void publish(NotificationEvent event){
        publisher.publishEvent(event);
    }
}
