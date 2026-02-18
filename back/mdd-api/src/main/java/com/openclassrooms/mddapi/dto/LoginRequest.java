package com.openclassrooms.mddapi.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * Payload d'authentification (login + mot de passe).
 */

@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {
    public String login;
    public String password;
}
