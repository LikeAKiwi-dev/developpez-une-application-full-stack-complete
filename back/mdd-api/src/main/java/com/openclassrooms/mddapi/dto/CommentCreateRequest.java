package com.openclassrooms.mddapi.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
/**
 * Payload de création d'un commentaire.
 */

@Getter
@Setter
public class CommentCreateRequest {
    @NotBlank
    private String content;
}
