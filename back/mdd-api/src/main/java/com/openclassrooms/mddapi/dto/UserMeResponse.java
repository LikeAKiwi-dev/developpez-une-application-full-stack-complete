package com.openclassrooms.mddapi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
/**
 * Réponse /me : informations de l'utilisateur connecté + abonnements.
 */

@Getter
@AllArgsConstructor
public class UserMeResponse {
    private Long id;
    private String username;
    private String email;
    private List<TopicDto> subscriptions;
}
