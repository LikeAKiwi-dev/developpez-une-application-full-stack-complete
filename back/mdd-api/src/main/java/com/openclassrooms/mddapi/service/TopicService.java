package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.repository.TopicRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service métier responsable de la gestion des topics.
 *
 * Responsabilités :
 * - Récupération de l’ensemble des topics disponibles
 */
@Service
public class TopicService {

    private final TopicRepository topicRepository;

    public TopicService(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    /**
     * Retourne tous les topics.
     *
     * @return liste des topics
     */
    public List<Topic> findAll() {
        return topicRepository.findAll();
    }
}
