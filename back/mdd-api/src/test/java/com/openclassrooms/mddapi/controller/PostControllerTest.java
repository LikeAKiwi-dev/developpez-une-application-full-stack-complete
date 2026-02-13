package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.*;
import com.openclassrooms.mddapi.service.CommentService;
import com.openclassrooms.mddapi.service.PostService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
@AutoConfigureMockMvc(addFilters = false)
class PostControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;


    @MockitoBean
    private PostService postService;

    @MockitoBean
    private CommentService commentService;

    PostControllerTest(MockMvc mvc, ObjectMapper objectMapper) {
        this.mvc = mvc;
        this.objectMapper = objectMapper;
    }

    @Test
    void create_returns_401_when_not_authenticated() throws Exception {
        PostCreateRequest req = new PostCreateRequest();
        req.setTitle("Titre");
        req.setContent("Contenu");
        req.setTopicId(1L);

        mvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test")
    void create_returns_200_and_calls_service() throws Exception {
        PostCreateRequest req = new PostCreateRequest();
        req.setTitle("Titre");
        req.setContent("Contenu");
        req.setTopicId(1L);

        TopicDto topic = new TopicDto(1L, "Java", "Desc");
        PostDto created = new PostDto(10L, "Titre", "Contenu", LocalDateTime.now(), "test", topic);

        when(postService.create(eq("test"), any(PostCreateRequest.class))).thenReturn(created);

        mvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.title").value("Titre"))
                .andExpect(jsonPath("$.content").value("Contenu"))
                .andExpect(jsonPath("$.authorUsername").value("test"))
                .andExpect(jsonPath("$.topic.id").value(1))
                .andExpect(jsonPath("$.topic.name").value("Java"));

        verify(postService).create(eq("test"), any(PostCreateRequest.class));
    }

    @Test
    @WithMockUser(username = "test")
    void getById_returns_200_and_calls_service() throws Exception {
        TopicDto topic = new TopicDto(1L, "Java", "Desc");
        PostDto post = new PostDto(10L, "Titre", "Contenu", LocalDateTime.now(), "test", topic);

        CommentDto c1 = new CommentDto(1L, "Salut", LocalDateTime.now(), "alice");
        CommentDto c2 = new CommentDto(2L, "Yo", LocalDateTime.now(), "bob");

        PostDetailResponse detail = new PostDetailResponse(post, List.of(c1, c2));

        when(postService.getById(10L)).thenReturn(detail);

        mvc.perform(get("/api/posts/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.post.id").value(10))
                .andExpect(jsonPath("$.post.title").value("Titre"))
                .andExpect(jsonPath("$.comments.length()").value(2));

        verify(postService).getById(10L);
    }

    @Test
    void addComment_returns_401_when_not_authenticated() throws Exception {
        CommentCreateRequest req = new CommentCreateRequest();
        req.setContent("Hello");

        mvc.perform(post("/api/posts/10/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test")
    void addComment_returns_200_and_calls_service() throws Exception {
        CommentCreateRequest req = new CommentCreateRequest();
        req.setContent("Hello");

        CommentDto created = new CommentDto(99L, "Hello", LocalDateTime.now(), "test");

        when(commentService.add(eq("test"), eq(10L), any(CommentCreateRequest.class))).thenReturn(created);

        mvc.perform(post("/api/posts/10/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(99))
                .andExpect(jsonPath("$.content").value("Hello"))
                .andExpect(jsonPath("$.authorUsername").value("test"));

        verify(commentService).add(eq("test"), eq(10L), any(CommentCreateRequest.class));
    }
}
