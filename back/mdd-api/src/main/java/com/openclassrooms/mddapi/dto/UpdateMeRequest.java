package com.openclassrooms.mddapi.dto;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * Payload de mise à jour du profil utilisateur (/me).
 * Les champs peuvent être partiels (optionnels).
 */

@Getter
@Setter
@NoArgsConstructor
public class UpdateMeRequest {
    private String username;
    private String email;

    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$",
            message = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
    )
    private String password;
}
