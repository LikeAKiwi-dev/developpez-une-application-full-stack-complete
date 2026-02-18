package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.PostDto;
import com.openclassrooms.mddapi.service.FeedService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST exposant le feed utilisateur.
 *
 * Endpoint :
 * - Récupération des posts liés aux abonnements de l’utilisateur connecté
 */


@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    /**
     * Retourne le feed (posts) de l’utilisateur authentifié.
     *
     * @param auth contexte d’authentification Spring Security
     * @return liste des posts du feed
     */
    @GetMapping
    public List<PostDto> getFeed(Authentication auth) {
        return feedService.getFeed(auth.getName());
    }
}
