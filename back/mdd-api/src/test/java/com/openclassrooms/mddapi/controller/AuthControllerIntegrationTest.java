package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.RegisterRequest;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldRegisterUser() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("jordan");
        request.setEmail("jordan@test.com");
        request.setPassword("password");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Account created successfully"));
    }

    @Test
    void shouldNotRegisterSameEmailTwice() throws Exception {
        RegisterRequest request1 = new RegisterRequest();
        request1.setUsername("user1");
        request1.setEmail("duplicate@test.com");
        request1.setPassword("password");

        RegisterRequest request2 = new RegisterRequest();
        request2.setUsername("user2");
        request2.setEmail("duplicate@test.com");
        request2.setPassword("password");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldNotRegisterSameUsernameTwice() throws Exception {
        RegisterRequest request1 = new RegisterRequest();
        request1.setUsername("sameuser");
        request1.setEmail("sameuser1@test.com");
        request1.setPassword("password");

        RegisterRequest request2 = new RegisterRequest();
        request2.setUsername("sameuser");
        request2.setEmail("sameuser2@test.com");
        request2.setPassword("password");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldLoginAndAccessMeWithJwt() throws Exception {
        userRepository.deleteAll();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"test","email":"test@test.com","password":"Password123!"}
                                """))
                .andExpect(status().isOk());

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"login":"test","password":"Password123!"}
                                """))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = json.get("token").asText();

        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}
