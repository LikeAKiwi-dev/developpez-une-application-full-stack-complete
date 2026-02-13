package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.UpdateMeRequest;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;


import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;


    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    UserControllerTest(MockMvc mvc, ObjectMapper objectMapper) {
        this.mvc = mvc;
        this.objectMapper = objectMapper;
    }

    @Test
    void me_returns_401_when_not_authenticated() throws Exception {
        mvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test")
    void me_returns_200_and_user_data() throws Exception {
        User u = new User();
        u.setId(3L);
        u.setUsername("test");
        u.setEmail("test@mail.com");
        u.setPasswordHash("HASH");

        Topic t = new Topic();
        t.setId(1L);
        t.setName("JavaScript");
        t.setDescription("Desc JS");

        Set<Topic> subs = new HashSet<>();
        subs.add(t);
        u.setSubscriptions(subs);

        when(userRepository.findByUsername("test")).thenReturn(Optional.of(u));

        mvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.username").value("test"))
                .andExpect(jsonPath("$.email").value("test@mail.com"))
                .andExpect(jsonPath("$.subscriptions.length()").value(1))
                .andExpect(jsonPath("$.subscriptions[0].id").value(1))
                .andExpect(jsonPath("$.subscriptions[0].name").value("JavaScript"));

        verify(userRepository).findByUsername("test");
    }

    @Test
    @WithMockUser(username = "test")
    void updateMe_returns_409_when_username_taken() throws Exception {
        User current = new User();
        current.setId(3L);
        current.setUsername("test");
        current.setEmail("test@mail.com");
        current.setPasswordHash("HASH");

        when(userRepository.findByUsername("test")).thenReturn(Optional.of(current));
        when(userRepository.existsByUsername("newname")).thenReturn(true);

        UpdateMeRequest req = new UpdateMeRequest();
        req.setUsername("newname");
        req.setEmail("test@mail.com");

        mvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());

        verify(userRepository).existsByUsername("newname");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @WithMockUser(username = "test")
    void updateMe_returns_409_when_email_taken() throws Exception {
        User current = new User();
        current.setId(3L);
        current.setUsername("test");
        current.setEmail("test@mail.com");
        current.setPasswordHash("HASH");

        when(userRepository.findByUsername("test")).thenReturn(Optional.of(current));
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail("new@mail.com")).thenReturn(true);

        UpdateMeRequest req = new UpdateMeRequest();
        req.setUsername("test");
        req.setEmail("new@mail.com");

        mvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());

        verify(userRepository).existsByEmail("new@mail.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @WithMockUser(username = "test")
    void updateMe_updates_username_email_and_passwordhash() throws Exception {
        User current = new User();
        current.setId(3L);
        current.setUsername("test");
        current.setEmail("test@mail.com");
        current.setPasswordHash("OLD_HASH");

        when(userRepository.findByUsername("test")).thenReturn(Optional.of(current));
        when(userRepository.existsByUsername("newname")).thenReturn(false);
        when(userRepository.existsByEmail("new@mail.com")).thenReturn(false);

        when(passwordEncoder.encode("newpass")).thenReturn("NEW_HASH");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateMeRequest req = new UpdateMeRequest();
        req.setUsername("newname");
        req.setEmail("new@mail.com");
        req.setPassword("newpass");

        mvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newname"))
                .andExpect(jsonPath("$.email").value("new@mail.com"));

        verify(passwordEncoder).encode("newpass");
        verify(userRepository).save(any(User.class));
    }
}
