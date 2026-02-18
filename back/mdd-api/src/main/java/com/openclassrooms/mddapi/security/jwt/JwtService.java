package com.openclassrooms.mddapi.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
/**
 * Service utilitaire JWT.
 * Gère la génération et la validation des tokens, et l'extraction du username.
 */

@Service
public class JwtService {

    private final JwtProperties properties;
    private final Key key;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
        this.key = Keys.hmacShaKeyFor(
                properties.getSecret().getBytes(StandardCharsets.UTF_8)
        );
    }

    /**
     * Génère un token JWT pour un username.
     *
     * @param username username à mettre dans le subject du token
     * @return token JWT signé
     */
    public String generateToken(String username) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + properties.getExpirationMs());

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }

    /**
     * Extrait le username (subject) depuis un token JWT.
     *
     * @param token token JWT
     * @return username contenu dans le token
     */
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Vérifie qu'un token JWT est valide (signature + structure + expiration).
     *
     * @param token token JWT
     * @return true si le token est valide
     */
    public boolean isValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
