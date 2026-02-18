package com.openclassrooms.mddapi.repository;

import com.openclassrooms.mddapi.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
/**
 * Repository JPA pour l'entité Post.
 */

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByTopicIdInOrderByCreatedAtDesc(Collection<Long> topicIds);
}
