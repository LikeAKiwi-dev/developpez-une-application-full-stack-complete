package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.*;
import com.openclassrooms.mddapi.service.CommentService;
import com.openclassrooms.mddapi.service.PostService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    public PostController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    @PostMapping
    public PostDto create(@Valid @RequestBody PostCreateRequest req, Authentication auth) {
        return postService.create(auth.getName(), req);
    }

    @GetMapping("/{id}")
    public PostDetailResponse getById(@PathVariable Long id) {
        return postService.getById(id);
    }

    @PostMapping("/{id}/comments")
    public CommentDto addComment(@PathVariable Long id, @Valid @RequestBody CommentCreateRequest req, Authentication auth) {
        return commentService.add(auth.getName(), id, req);
    }
}
