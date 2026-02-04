package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.service.SubscriptionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SubscriptionController.class)
class SubscriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SubscriptionService subscriptionService;

    @Test
    void subscribe_shouldReturn401_whenNotAuthenticated() throws Exception {
        mockMvc.perform(post("/api/subscriptions/{topicId}", 1L).with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test")
    void subscribe_shouldCallService_whenAuthenticated() throws Exception {
        mockMvc.perform(post("/api/subscriptions/{topicId}", 1L).with(csrf()))
                .andExpect(status().isOk());

        verify(subscriptionService).subscribe("test", 1L);
    }

    @Test
    void unsubscribe_shouldReturn401_whenNotAuthenticated() throws Exception {
        mockMvc.perform(delete("/api/subscriptions/{topicId}", 1L).with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test")
    void unsubscribe_shouldCallService_whenAuthenticated() throws Exception {
        mockMvc.perform(delete("/api/subscriptions/{topicId}", 1L).with(csrf()))
                .andExpect(status().isOk());

        verify(subscriptionService).unsubscribe("test", 1L);
    }
}
