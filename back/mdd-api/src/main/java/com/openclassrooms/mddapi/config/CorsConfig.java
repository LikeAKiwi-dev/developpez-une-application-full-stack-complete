package com.openclassrooms.mddapi.config;

import lombok.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
/**
 * Configuration CORS de l'API.
 * Autorise les appels du front sur les endpoints /api/** avec les méthodes HTTP nécessaires.
 */

@Configuration
public class CorsConfig {
    /**
     * Déclare un {@link org.springframework.web.servlet.config.annotation.WebMvcConfigurer}
     * configurant les règles CORS sur /api/**.
     *
     * @return un configurer appliquant les règles CORS
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            /**
             * Configure les règles CORS appliquées par l’API.
             *
             * @param registry registre Spring des mappings CORS
             */
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry){
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
