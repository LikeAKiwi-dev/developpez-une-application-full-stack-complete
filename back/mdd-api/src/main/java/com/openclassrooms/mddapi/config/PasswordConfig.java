package com.openclassrooms.mddapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
/**
 * Configuration du composant de hachage des mots de passe.
 * Fournit un {@link org.springframework.security.crypto.password.PasswordEncoder}.
 */

@Configuration
public class PasswordConfig {
    /**
     * Fournit l'encodeur de mot de passe utilisé par l'application (BCrypt).
     *
     * @return encodeur BCrypt
     */

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
