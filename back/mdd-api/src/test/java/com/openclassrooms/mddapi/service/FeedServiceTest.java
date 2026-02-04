package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Set;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class FeedServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PostRepository postRepository;
    @Mock private PostService postService;

    @InjectMocks
    private FeedService feedService;

    @Test
    void getFeed_shouldReturnEmpty_whenNoSubscriptions() {
        User u = new User();
        u.setUsername("test");
        u.setSubscriptions(Set.of());

        when(userRepository.findByUsername("test")).thenReturn(Optional.of(u));

        var res = feedService.getFeed("test");
        assertTrue(res.isEmpty());
        verifyNoInteractions(postRepository);
    }

    @Test
    void getFeed_shouldCallRepository_whenSubscriptionsExist() {
        Topic t = new Topic();
        t.setId(1L);

        User u = new User();
        u.setUsername("test");
        u.setSubscriptions(Set.of(t));

        when(userRepository.findByUsername("test")).thenReturn(Optional.of(u));
        when(postRepository.findByTopicIdInOrderByCreatedAtDesc(any())).thenReturn(java.util.List.of());

        feedService.getFeed("test");

        verify(postRepository).findByTopicIdInOrderByCreatedAtDesc(any());
    }
}
