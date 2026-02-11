package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.dto.RegisterRequest;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.security.jwt.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;


import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {

        if (userRepository.existsByEmail(req.email)) {
            return ResponseEntity.status(409).body(Map.of("message", "Email already used"));
        }
        if (userRepository.existsByUsername(req.username)) {
            return ResponseEntity.status(409).body(Map.of("message", "Username already used"));
        }

        User u = new User();
        u.setEmail(req.email);
        u.setUsername(req.username);
        u.setPasswordHash(passwordEncoder.encode(req.password));
        userRepository.save(u);

        String token = jwtService.generateToken(u.getUsername());

        return ResponseEntity.status(201).body(Map.of(
                "token", token,
                "message", "Account created successfully"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.login, req.password)
        );

        String token = jwtService.generateToken(authentication.getName());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "Successful login"
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of(
                "message", "Successful logout"
        ));
    }
}
