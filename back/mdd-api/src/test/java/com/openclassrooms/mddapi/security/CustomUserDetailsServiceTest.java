package com.openclassrooms.mddapi.security;

import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class CustomUserDetailsServiceTest {

    @Autowired
    private CustomUserDetailsService service;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldLoadUserByEmail() {
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@email.com");
        user.setPasswordHash("hash"); // pas besoin d'un vrai hash ici
        userRepository.save(user);

        UserDetails details = service.loadUserByUsername("test@email.com");
        assertNotNull(details);
        assertEquals("testuser", details.getUsername());
    }

    @Test
    void shouldLoadUserByUsername() {
        User user = new User();
        user.setUsername("john");
        user.setEmail("john@email.com");
        user.setPasswordHash("hash");
        userRepository.save(user);

        UserDetails details = service.loadUserByUsername("john");
        assertNotNull(details);
        assertEquals("john", details.getUsername());
    }

    @Test
    void shouldThrowExceptionIfUserNotFound() {
        assertThrows(UsernameNotFoundException.class,
                () -> service.loadUserByUsername("unknown"));
    }
}
