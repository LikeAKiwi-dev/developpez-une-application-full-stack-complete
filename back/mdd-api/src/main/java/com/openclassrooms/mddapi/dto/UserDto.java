package com.openclassrooms.mddapi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
/**
 * DTO représentant un utilisateur (données exposées au front).
 */

@Getter
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
}
