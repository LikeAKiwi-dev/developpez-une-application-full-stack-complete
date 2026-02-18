package com.openclassrooms.mddapi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
/**
 * Réponse détaillée d'un post : post + liste des commentaires.
 */

@Getter
@AllArgsConstructor
public class PostDetailResponse {
    private PostDto post;
    private List<CommentDto> comments;
}
