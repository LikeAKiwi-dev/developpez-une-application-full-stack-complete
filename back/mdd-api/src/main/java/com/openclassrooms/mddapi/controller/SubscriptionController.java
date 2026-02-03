package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/{topicId}")
    public void subscribe(@PathVariable Long topicId, Authentication auth) {
        subscriptionService.subscribe(auth.getName(), topicId);
    }

    @DeleteMapping("/{topicId}")
    public void unsubscribe(@PathVariable Long topicId, Authentication auth) {
        subscriptionService.unsubscribe(auth.getName(), topicId);
    }
}

