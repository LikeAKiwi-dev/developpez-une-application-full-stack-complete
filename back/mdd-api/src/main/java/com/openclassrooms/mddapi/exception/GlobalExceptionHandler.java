package com.openclassrooms.mddapi.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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
}
