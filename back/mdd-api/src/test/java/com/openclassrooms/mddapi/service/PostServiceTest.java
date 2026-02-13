package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.CommentDto;
import com.openclassrooms.mddapi.dto.PostCreateRequest;
import com.openclassrooms.mddapi.dto.PostDetailResponse;
import com.openclassrooms.mddapi.dto.PostDto;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private PostService postService;

    @Test
    void create_shouldCreatePostAndReturnDto() {
        // Arrange
        String username = "jordan";
        User author = new User();
        author.setId(10L);
        author.setUsername(username);

        Topic topic = new Topic();
        topic.setId(2L);
        topic.setName("Java");
        topic.setDescription("desc");

        PostCreateRequest req = new PostCreateRequest();
        req.setTitle("Titre");
        req.setContent("Contenu");
        req.setTopicId(2L);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(author));
        when(topicRepository.findById(2L)).thenReturn(Optional.of(topic));

        // when save is called, return the same entity with an id
        when(postRepository.save(any(Post.class))).thenAnswer(inv -> {
            Post p = inv.getArgument(0);
            p.setId(99L);
            return p;
        });

        // Act
        PostDto dto = postService.create(username, req);

        // Assert
        assertThat(dto.getId()).isEqualTo(99L);
        assertThat(dto.getTitle()).isEqualTo("Titre");
        assertThat(dto.getContent()).isEqualTo("Contenu");
        assertThat(dto.getAuthorUsername()).isEqualTo(username);
        assertThat(dto.getTopic()).isNotNull();
        assertThat(dto.getTopic().getId()).isEqualTo(2L);
        assertThat(dto.getTopic().getName()).isEqualTo("Java");
        assertThat(dto.getCreatedAt()).isNotNull();

        ArgumentCaptor<Post> savedCaptor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(savedCaptor.capture());
        Post saved = savedCaptor.getValue();
        assertThat(saved.getAuthor()).isSameAs(author);
        assertThat(saved.getTopic()).isSameAs(topic);
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    void create_shouldThrowUnauthorized_whenUserNotFound() {
        // Arrange
        PostCreateRequest req = new PostCreateRequest();
        req.setTitle("Titre");
        req.setContent("Contenu");
        req.setTopicId(1L);

        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> postService.create("unknown", req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
                });

        verifyNoInteractions(topicRepository);
        verify(postRepository, never()).save(any());
    }

    @Test
    void create_shouldThrowNotFound_whenTopicNotFound() {
        // Arrange
        String username = "jordan";
        User author = new User();
        author.setUsername(username);

        PostCreateRequest req = new PostCreateRequest();
        req.setTitle("Titre");
        req.setContent("Contenu");
        req.setTopicId(123L);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(author));
        when(topicRepository.findById(123L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> postService.create(username, req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(rse.getReason()).isEqualTo("Topic not found");
                });

        verify(postRepository, never()).save(any());
    }

    @Test
    void getById_shouldReturnDetails_withCommentsOrdered() {
        // Arrange
        String username = "jordan";
        User author = new User();
        author.setId(10L);
        author.setUsername(username);

        Topic topic = new Topic();
        topic.setId(2L);
        topic.setName("Java");
        topic.setDescription("desc");

        Post post = new Post();
        post.setId(5L);
        post.setTitle("Titre");
        post.setContent("Contenu");
        post.setCreatedAt(LocalDateTime.of(2026, 2, 13, 11, 0));
        post.setAuthor(author);
        post.setTopic(topic);

        Comment c1 = new Comment();
        c1.setId(1L);
        c1.setContent("hello");
        c1.setCreatedAt(LocalDateTime.of(2026, 2, 13, 11, 1));
        User u1 = new User();
        u1.setUsername("alice");
        c1.setAuthor(u1);

        Comment c2 = new Comment();
        c2.setId(2L);
        c2.setContent("world");
        c2.setCreatedAt(LocalDateTime.of(2026, 2, 13, 11, 2));
        User u2 = new User();
        u2.setUsername("bob");
        c2.setAuthor(u2);

        when(postRepository.findById(5L)).thenReturn(Optional.of(post));
        when(commentRepository.findByPostIdOrderByCreatedAtAsc(5L)).thenReturn(List.of(c1, c2));

        // Act
        PostDetailResponse res = postService.getById(5L);

        // Assert
        assertThat(res.getPost()).isNotNull();
        assertThat(res.getPost().getId()).isEqualTo(5L);
        assertThat(res.getPost().getTopic().getName()).isEqualTo("Java");
        assertThat(res.getPost().getAuthorUsername()).isEqualTo(username);

        assertThat(res.getComments()).hasSize(2);
        CommentDto d1 = res.getComments().get(0);
        assertThat(d1.getId()).isEqualTo(1L);
        assertThat(d1.getAuthorUsername()).isEqualTo("alice");

        CommentDto d2 = res.getComments().get(1);
        assertThat(d2.getId()).isEqualTo(2L);
        assertThat(d2.getAuthorUsername()).isEqualTo("bob");
    }

    @Test
    void getById_shouldThrowNotFound_whenPostNotFound() {
        when(postRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.getById(404L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(rse.getReason()).isEqualTo("Post not found");
                });

        verifyNoInteractions(commentRepository);
    }
}