package com.openclassrooms.mddapi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
/**
 * DTO représentant un topic (données exposées au front).
 */

@Getter
@AllArgsConstructor
public class TopicDto {
    private Long id;
    private String name;
    private String description;
}
