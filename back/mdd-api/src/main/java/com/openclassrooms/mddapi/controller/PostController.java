package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.*;
import com.openclassrooms.mddapi.service.CommentService;
import com.openclassrooms.mddapi.service.PostService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur REST responsable des opérations liées aux posts.
 *
 * Endpoints :
 * - Création d’un post
 * - Récupération d’un post avec ses commentaires
 * -  Ajout d’un commentaire sur un post
 */

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    public PostController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    /**
     * Crée un post pour l’utilisateur authentifié.
     *
     * @param req payload de création de post validé
     * @param auth contexte d’authentification Spring Security
     * @return post créé
     */
    @PostMapping
    public PostDto create(@Valid @RequestBody PostCreateRequest req, Authentication auth) {
        return postService.create(auth.getName(), req);
    }

    /**
     * Retourne le détail d’un post.
     *
     * @param id identifiant du post
     * @return détail du post (post + commentaires)
     */
    @GetMapping("/{id}")
    public PostDetailResponse getById(@PathVariable Long id) {
        return postService.getById(id);
    }

    /**
     * Ajoute un commentaire à un post.
     *
     * @param id identifiant du post
     * @param req payload de création de commentaire validé
     * @param auth contexte d’authentification Spring Security
     * @return commentaire créé
     */
    @PostMapping("/{id}/comments")
    public CommentDto addComment(@PathVariable Long id, @Valid @RequestBody CommentCreateRequest req, Authentication auth) {
        return commentService.add(auth.getName(), id, req);
    }
}
