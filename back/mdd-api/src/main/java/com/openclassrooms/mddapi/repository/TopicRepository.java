package com.openclassrooms.mddapi.repository;

import com.openclassrooms.mddapi.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 * Repository JPA pour l'entité Topic.
 */

public interface TopicRepository extends JpaRepository<Topic, Long> {}
