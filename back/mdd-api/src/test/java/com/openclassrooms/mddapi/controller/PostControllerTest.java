package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.*;
import com.openclassrooms.mddapi.service.CommentService;
import com.openclassrooms.mddapi.service.PostService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PostControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private PostService postService;

    @MockitoBean
    private CommentService commentService;

    @Test
    void create_returns_401_when_not_authenticated() throws Exception {
        String body = """
            {"title":"Hello","content":"World","topicId":1}
            """;

        mvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "alice")
    void create_returns_200_and_calls_service() throws Exception {
        LocalDateTime now = LocalDateTime.now();
        TopicDto topic = new TopicDto(1L, "Java", "Desc");
        PostDto created = new PostDto(10L, "Hello", "World", now, "alice", topic);

        when(postService.create(eq("alice"), any(PostCreateRequest.class)))
                .thenReturn(created);

        String body = """
            {"title":"Hello","content":"World","topicId":1}
            """;

        mvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.title").value("Hello"))
                .andExpect(jsonPath("$.authorUsername").value("alice"))
                .andExpect(jsonPath("$.topic.id").value(1));

        ArgumentCaptor<PostCreateRequest> captor = ArgumentCaptor.forClass(PostCreateRequest.class);
        verify(postService).create(eq("alice"), captor.capture());
        assertThat(captor.getValue().getTitle()).isEqualTo("Hello");
        assertThat(captor.getValue().getContent()).isEqualTo("World");
        assertThat(captor.getValue().getTopicId()).isEqualTo(1L);
    }

    @Test
    void getById_returns_401_when_not_authenticated() throws Exception {
        mvc.perform(get("/api/posts/10"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "alice")
    void getById_returns_200_and_calls_service() throws Exception {
        LocalDateTime now = LocalDateTime.now();
        TopicDto topic = new TopicDto(1L, "Java", "Desc");
        PostDto post = new PostDto(10L, "Hello", "World", now, "alice", topic);
        List<CommentDto> comments = List.of(new CommentDto(100L, "Nice", now, "bob"));

        PostDetailResponse response = new PostDetailResponse(post, comments);

        when(postService.getById(10L)).thenReturn(response);

        mvc.perform(get("/api/posts/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.post.id").value(10))
                .andExpect(jsonPath("$.comments[0].id").value(100));

        verify(postService).getById(10L);
    }

    @Test
    void addComment_returns_401_when_not_authenticated() throws Exception {
        String body = """
            {"content":"Nice"}
            """;

        mvc.perform(post("/api/posts/10/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "alice")
    void addComment_returns_200_and_calls_service() throws Exception {
        when(commentService.add(eq("alice"), eq(10L), any(CommentCreateRequest.class)))
        .thenAnswer(inv -> null);

        String body = """
            {"content":"Nice"}
            """;

        mvc.perform(post("/api/posts/10/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());

        ArgumentCaptor<CommentCreateRequest> captor = ArgumentCaptor.forClass(CommentCreateRequest.class);
        verify(commentService).add(eq("alice"), eq(10L), captor.capture());
        assertThat(captor.getValue().getContent()).isEqualTo("Nice");
    }
}
