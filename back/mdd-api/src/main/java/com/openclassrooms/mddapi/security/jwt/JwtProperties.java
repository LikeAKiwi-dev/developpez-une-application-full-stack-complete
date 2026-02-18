package com.openclassrooms.mddapi.security.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
/**
 * Propriétés de configuration JWT chargées depuis application.properties/yml.
 * Préfixe : "jwt".
 */

@Setter
@Getter
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private String secret;
    private long expirationMs;

}
