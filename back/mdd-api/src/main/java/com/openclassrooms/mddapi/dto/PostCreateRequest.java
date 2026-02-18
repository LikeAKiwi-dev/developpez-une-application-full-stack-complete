package com.openclassrooms.mddapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
/**
 * Payload de création d'un post.
 */

@Getter
@Setter
public class PostCreateRequest {

    @NotBlank
    @Size(max = 150)
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private Long topicId;
}
