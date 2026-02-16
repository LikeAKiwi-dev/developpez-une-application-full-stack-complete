package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    @Test
    void me_returns_401_when_not_authenticated() throws Exception {
        mvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "alice")
    void me_returns_200_and_user_data() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setUsername("alice");
        user.setEmail("a@a.com");

        Topic t = new Topic();
        t.setId(10L);
        t.setName("Java");
        t.setDescription("Desc");

        user.setSubscriptions(Set.of(t));

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));

        mvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("alice"))
                .andExpect(jsonPath("$.email").value("a@a.com"))
                .andExpect(jsonPath("$.subscriptions[0].id").value(10))
                .andExpect(jsonPath("$.subscriptions[0].name").value("Java"));
    }

    @Test
    @WithMockUser(username = "alice")
    void updateMe_returns_409_when_username_taken() throws Exception {
        User current = new User();
        current.setId(1L);
        current.setUsername("alice");
        current.setEmail("a@a.com");

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(current));
        when(userRepository.existsByUsername("bob")).thenReturn(true);

        String body = """
            {"username":"bob","email":"a@a.com","password":null}
            """;

        mvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(username = "alice")
    void updateMe_returns_409_when_email_taken() throws Exception {
        User current = new User();
        current.setId(1L);
        current.setUsername("alice");
        current.setEmail("a@a.com");

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(current));
        when(userRepository.existsByEmail("b@b.com")).thenReturn(true);

        String body = """
            {"username":"alice","email":"b@b.com","password":null}
            """;

        mvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(username = "alice")
    void updateMe_updates_username_email_and_passwordhash() throws Exception {
        User current = new User();
        current.setId(1L);
        current.setUsername("alice");
        current.setEmail("a@a.com");
        current.setPasswordHash("OLD");

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(current));
        when(userRepository.existsByUsername("bob")).thenReturn(false);
        when(userRepository.existsByEmail("b@b.com")).thenReturn(false);
        when(passwordEncoder.encode("newpass")).thenReturn("HASH");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        String body = """
            {"username":"bob","email":"b@b.com","password":"newpass"}
            """;

        mvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("bob"))
                .andExpect(jsonPath("$.email").value("b@b.com"));

        verify(passwordEncoder).encode("newpass");
        verify(userRepository).save(any(User.class));
    }
}
