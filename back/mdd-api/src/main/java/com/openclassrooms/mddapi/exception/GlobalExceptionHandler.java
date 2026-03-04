package com.openclassrooms.mddapi.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

/**
 * Gestion centralisée des exceptions de l'API.
 * Convertit notamment les erreurs de validation (Bean Validation) en réponse JSON exploitable par le front.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Transforme les erreurs de validation (@Valid) en réponse 400 avec une map de champs -> message.
     *
     * @param ex exception de validation Spring MVC
     * @return réponse 400 contenant un message et la liste des erreurs par champ
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError err : ex.getBindingResult().getFieldErrors()) {
            errors.put(err.getField(), err.getDefaultMessage());
        }

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Validation error");
        body.put("errors", errors);

        return ResponseEntity.badRequest().body(body);
    }

    /**
     * Intercepte les ResponseStatusException levées dans les services ou contrôleurs.
     * Permet de transformer ces exceptions en une réponse JSON standardisée (ApiError)
     * contenant le statut HTTP, le message d'erreur et le chemin de la requête.
     *
     * Exemple : une ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found")
     * sera convertie en réponse JSON avec le statut 404.
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleResponseStatus(ResponseStatusException ex, HttpServletRequest req) {
        HttpStatus status = (HttpStatus) ex.getStatusCode();
        String message = ex.getReason() != null ? ex.getReason() : "Erreur";
        ApiError body = new ApiError(status.value(), status.getReasonPhrase(), message, req.getRequestURI());
        return ResponseEntity.status(status).body(body);
    }

    /**
     * Gestionnaire global des exceptions non prévues.
     * Permet d'éviter l'exposition de détails techniques au client et
     * renvoie une réponse HTTP 500 standardisée.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest req) {
        ApiError body = new ApiError(500, "Internal Server Error", "Une erreur est survenue", req.getRequestURI());
        return ResponseEntity.status(500).body(body);
    }
}
