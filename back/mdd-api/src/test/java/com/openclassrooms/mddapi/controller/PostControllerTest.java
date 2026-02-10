package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.config.SecurityConfig;
import com.openclassrooms.mddapi.security.jwt.JwtAuthenticationFilter;
import com.openclassrooms.mddapi.security.jwt.JwtService;
import com.openclassrooms.mddapi.service.CommentService;
import com.openclassrooms.mddapi.service.PostService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PostController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PostService postService;

    @MockitoBean
    private CommentService commentService;

    // Dépendances du JwtAuthenticationFilter
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    void create_shouldReturn401_whenNotAuthenticated() throws Exception {
        mockMvc.perform(post("/api/posts")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"T\",\"content\":\"C\",\"topicId\":1}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test")
    void create_shouldCallService_whenAuthenticated() throws Exception {
        mockMvc.perform(post("/api/posts")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"T\",\"content\":\"C\",\"topicId\":1}"))
                .andExpect(status().isOk());

        verify(postService).create(org.mockito.ArgumentMatchers.eq("test"), org.mockito.ArgumentMatchers.any());
    }

    @Test
    @WithMockUser(username = "test")
    void getById_shouldCallService() throws Exception {
        mockMvc.perform(get("/api/posts/{id}", 10L))
                .andExpect(status().isOk());

        verify(postService).getById(10L);
    }

    @Test
    void addComment_shouldReturn401_whenNotAuthenticated() throws Exception {
        mockMvc.perform(post("/api/posts/{id}/comments", 10L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"hello\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test")
    void addComment_shouldCallService_whenAuthenticated() throws Exception {
        mockMvc.perform(post("/api/posts/{id}/comments", 10L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"hello\"}"))
                .andExpect(status().isOk());

        verify(commentService).add(
                org.mockito.ArgumentMatchers.eq("test"),
                org.mockito.ArgumentMatchers.eq(10L),
                org.mockito.ArgumentMatchers.any()
        );
    }
}
