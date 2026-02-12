package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.*;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public PostDto create(String username, PostCreateRequest req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Topic topic = topicRepository.findById(req.getTopicId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

        Post post = new Post();
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        post.setCreatedAt(LocalDateTime.now());
        post.setAuthor(user);
        post.setTopic(topic);

        Post saved = postRepository.save(post);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public PostDetailResponse getById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        var comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(c -> new CommentDto(
                        c.getId(),
                        c.getContent(),
                        c.getCreatedAt(),
                        c.getAuthor().getUsername()
                ))
                .collect(Collectors.toList());

        return new PostDetailResponse(toDto(post), comments);
    }

    public PostDto toDto(Post post) {
        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt(),
                post.getAuthor().getUsername(),
                new TopicDto(post.getTopic().getId(), post.getTopic().getName(), post.getTopic().getDescription())
        );
    }
}
