package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.CommentCreateRequest;
import com.openclassrooms.mddapi.dto.CommentDto;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    @Test
    void add_shouldCreateCommentAndReturnDto() {
        // Arrange
        String username = "jordan";
        User user = new User();
        user.setId(1L);
        user.setUsername(username);

        Post post = new Post();
        post.setId(5L);

        CommentCreateRequest req = new CommentCreateRequest();
        req.setContent("Salut !");

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(postRepository.findById(5L)).thenReturn(Optional.of(post));

        when(commentRepository.save(any(Comment.class))).thenAnswer(inv -> {
            Comment c = inv.getArgument(0);
            c.setId(50L);
            return c;
        });

        // Act
        CommentDto dto = commentService.add(username, 5L, req);

        // Assert
        assertThat(dto.getId()).isEqualTo(50L);
        assertThat(dto.getContent()).isEqualTo("Salut !");
        assertThat(dto.getAuthorUsername()).isEqualTo(username);
        assertThat(dto.getCreatedAt()).isNotNull();

        ArgumentCaptor<Comment> captor = ArgumentCaptor.forClass(Comment.class);
        verify(commentRepository).save(captor.capture());
        Comment saved = captor.getValue();
        assertThat(saved.getContent()).isEqualTo("Salut !");
        assertThat(saved.getAuthor()).isSameAs(user);
        assertThat(saved.getPost()).isSameAs(post);
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    void add_shouldThrowUnauthorized_whenUserNotFound() {
        CommentCreateRequest req = new CommentCreateRequest();
        req.setContent("x");

        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> commentService.add("unknown", 1L, req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
                });

        verifyNoInteractions(postRepository);
        verify(commentRepository, never()).save(any());
    }

    @Test
    void add_shouldThrowNotFound_whenPostNotFound() {
        String username = "jordan";
        User user = new User();
        user.setUsername(username);

        CommentCreateRequest req = new CommentCreateRequest();
        req.setContent("x");

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> commentService.add(username, 999L, req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(rse.getReason()).isEqualTo("Post not found");
                });

        verify(commentRepository, never()).save(any());
    }
}