package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SubscriptionServiceTest {

    private UserRepository userRepository;
    private TopicRepository topicRepository;
    private SubscriptionService subscriptionService;

    @BeforeEach
    void setup() {
        userRepository = mock(UserRepository.class);
        topicRepository = mock(TopicRepository.class);
        subscriptionService = new SubscriptionService(userRepository, topicRepository);
    }

    @Test
    void subscribe_shouldAddTopicToUserSubscriptions() {
        // Arrange
        String username = "test";
        Long topicId = 1L;

        User user = new User();
        user.setUsername(username);

        Topic topic = new Topic();
        topic.setId(topicId);
        topic.setName("Java");

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(topicRepository.findById(topicId)).thenReturn(Optional.of(topic));

        // Act
        subscriptionService.subscribe(username, topicId);

        // Assert
        assertTrue(user.getSubscriptions().contains(topic));
        verify(userRepository).findByUsername(username);
        verify(topicRepository).findById(topicId);
        verifyNoMoreInteractions(userRepository, topicRepository);
    }

    @Test
    void subscribe_shouldThrow401_whenUserNotFound() {
        // Arrange
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        // Act
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> subscriptionService.subscribe("unknown", 1L));

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        verify(userRepository).findByUsername("unknown");
        verifyNoInteractions(topicRepository);
    }

    @Test
    void subscribe_shouldThrow404_whenTopicNotFound() {
        // Arrange
        String username = "test";
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(new User()));
        when(topicRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> subscriptionService.subscribe(username, 999L));

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        verify(userRepository).findByUsername(username);
        verify(topicRepository).findById(999L);
    }

    @Test
    void unsubscribe_shouldRemoveTopicFromUserSubscriptions() {
        // Arrange
        String username = "test";
        Long topicId = 1L;

        Topic topic = new Topic();
        topic.setId(topicId);
        topic.setName("Java");

        User user = new User();
        user.setUsername(username);
        user.getSubscriptions().add(topic);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(topicRepository.findById(topicId)).thenReturn(Optional.of(topic));

        // Act
        subscriptionService.unsubscribe(username, topicId);

        // Assert
        assertFalse(user.getSubscriptions().contains(topic));
        verify(userRepository).findByUsername(username);
        verify(topicRepository).findById(topicId);
        verifyNoMoreInteractions(userRepository, topicRepository);
    }
}
