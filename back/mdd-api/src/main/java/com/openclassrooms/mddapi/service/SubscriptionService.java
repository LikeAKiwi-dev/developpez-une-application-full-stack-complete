package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.model.Topic;
import org.springframework.transaction.annotation.Transactional;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Service métier responsable de la gestion des abonnements aux topics.
 *
 * Responsabilités :
 * - Abonnement d’un utilisateur à un topic
 * - Désabonnement d’un utilisateur
 * - Vérification de l’existence du topic
 *
 * Les modifications sont persistées automatiquement via le contexte JPA transactionnel.
 */

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionService {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;

    /**
     * Abonne un utilisateur à un topic.
     *
     * @param username username de l’utilisateur
     * @param topicId identifiant du topic
     */
    public void subscribe(String username, Long topicId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

        boolean alreadySubscribed = user.getSubscriptions().stream().anyMatch(t -> t.getId().equals(topicId));
        if (!alreadySubscribed) {
            user.getSubscriptions().add(topic);
        }
    }

    /**
     * Désabonne un utilisateur d’un topic.
     *
     * @param username username de l’utilisateur
     * @param topicId identifiant du topic
     */
    public void unsubscribe(String username, Long topicId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

        user.getSubscriptions().remove(topic);
    }
}
