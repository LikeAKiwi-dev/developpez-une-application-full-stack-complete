package com.openclassrooms.mddapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
/**
 * Point d’entrée de l’application Spring Boot.
 * Lance l’API MDD et initialise le contexte Spring.
 */
@ConfigurationPropertiesScan
@SpringBootApplication
public class MddApiApplication {

    /**
     * Point d’entrée de l’application Spring Boot.
     *
     * @param args arguments de démarrage
     */
    public static void main(String[] args) {
        SpringApplication.run(MddApiApplication.class, args);
    }
}
