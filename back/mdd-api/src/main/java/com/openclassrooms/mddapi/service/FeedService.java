package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.PostDto;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service métier responsable de la construction du feed utilisateur.
 *
 * Responsabilités :
 * - Récupération des posts liés aux topics suivis par l’utilisateur
 * - Tri des posts par date (ascendant ou descendant)
 *
 * Ne contient aucune logique de sécurité, celle-ci est gérée en amont.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeedService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostService postService;

    /**
     * Construit le feed (posts) de l’utilisateur.
     *
     * @param username username de l’utilisateur
     * @return liste des posts (DTO)
     */
    public List<PostDto> getFeed(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        var topicIds = user.getSubscriptions().stream().map(t -> t.getId()).collect(Collectors.toList());
        if (topicIds.isEmpty()) {
            return Collections.emptyList();
        }

        return postRepository.findByTopicIdInOrderByCreatedAtDesc(topicIds)
                .stream()
                .map(postService::toDto)
                .collect(Collectors.toList());
    }
}
