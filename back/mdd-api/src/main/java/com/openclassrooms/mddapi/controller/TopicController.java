package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.TopicResponse;
import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.service.TopicService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST responsable de l’exposition des topics disponibles.
 *
 * Endpoint :
 * - Récupération de la liste complète des topics
 */

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    /**
     * Retourne la liste des topics.
     *
     * @return liste des topics (format API)
     */
    @GetMapping
    public List<TopicResponse> getAll() {
        return topicService.findAll()
                .stream()
                .map(t -> new TopicResponse(
                        t.getId(),
                        t.getName(),
                        t.getDescription(),
                        t.getSubscribers()
                                .stream()
                                .map(u -> new UserDto(u.getId(), u.getUsername()))
                                .toList()
                ))
                .toList();
    }
}
