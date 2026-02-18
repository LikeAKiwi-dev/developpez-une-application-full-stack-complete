package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.CommentCreateRequest;
import com.openclassrooms.mddapi.dto.CommentDto;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

/**
 * Service métier responsable de la gestion des commentaires.
 *
 * Responsabilités :
 * - Ajout d’un commentaire sur un post existant
 * - Association du commentaire à l’utilisateur authentifié
 *
 * Les opérations sont transactionnelles.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    /**
     * Crée un commentaire pour un post.
     *
     * @param username username de l’auteur
     * @param postId identifiant du post
     * @param req payload de création de commentaire
     * @return commentaire créé (DTO)
     */
    public CommentDto add(String username, Long postId, CommentCreateRequest req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        Comment c = new Comment();
        c.setContent(req.getContent());
        c.setCreatedAt(LocalDateTime.now());
        c.setAuthor(user);
        c.setPost(post);

        Comment saved = commentRepository.save(c);
        return new CommentDto(saved.getId(), saved.getContent(), saved.getCreatedAt(), user.getUsername());
    }
}
