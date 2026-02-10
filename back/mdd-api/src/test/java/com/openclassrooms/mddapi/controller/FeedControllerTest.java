package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.config.SecurityConfig;
import com.openclassrooms.mddapi.security.jwt.JwtAuthenticationFilter;
import com.openclassrooms.mddapi.security.jwt.JwtService;
import com.openclassrooms.mddapi.service.FeedService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FeedController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class FeedControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FeedService feedService;

    // Dépendances du JwtAuthenticationFilter
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    void getFeed_shouldReturn401_whenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/feed"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test")
    void getFeed_shouldCallService_whenAuthenticated() throws Exception {
        mockMvc.perform(get("/api/feed"))
                .andExpect(status().isOk());

        verify(feedService).getFeed("test");
    }
}
