package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.service.SubscriptionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur REST responsable des abonnements aux topics.
 *
 * Endpoints :
 * - Abonnement à un topic
 * - Désabonnement d’un topic
 */

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    /**
     * Abonne l’utilisateur authentifié à un topic.
     *
     * @param topicId identifiant du topic
     * @param auth contexte d’authentification Spring Security
     */
    @PostMapping("/{topicId}")
    public void subscribe(@PathVariable Long topicId, Authentication auth) {
        subscriptionService.subscribe(auth.getName(), topicId);
    }

    /**
     * Désabonne l’utilisateur authentifié d’un topic.
     *
     * @param topicId identifiant du topic
     * @param auth contexte d’authentification Spring Security
     */
    @DeleteMapping("/{topicId}")
    public void unsubscribe(@PathVariable Long topicId, Authentication auth) {
        subscriptionService.unsubscribe(auth.getName(), topicId);
    }
}

