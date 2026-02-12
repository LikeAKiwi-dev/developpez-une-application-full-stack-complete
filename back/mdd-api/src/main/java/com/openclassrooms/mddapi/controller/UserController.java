package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.TopicDto;
import com.openclassrooms.mddapi.dto.UpdateMeRequest;
import com.openclassrooms.mddapi.dto.UserMeResponse;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<UserMeResponse> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();

        User user = userRepository.findByUsername(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        List<TopicDto> subscriptions = user.getSubscriptions()
                .stream()
                .map(t -> new TopicDto(t.getId(), t.getName(), t.getDescription()))
                .toList();

        return ResponseEntity.ok(new UserMeResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                subscriptions
        ));
    }

    @PutMapping("/me")
    public ResponseEntity<UserMeResponse> updateMe(@RequestBody UpdateMeRequest req, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();

        User user = userRepository.findByUsername(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        if (req.getUsername() != null && !req.getUsername().isBlank() && !req.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(req.getUsername())) {
                return ResponseEntity.status(409).body(new UserMeResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getSubscriptions().stream().map(t -> new TopicDto(t.getId(), t.getName(), t.getDescription())).toList()
                ));
            }
            user.setUsername(req.getUsername());
        }

        if (req.getEmail() != null && !req.getEmail().isBlank() && !req.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(req.getEmail())) {
                return ResponseEntity.status(409).body(new UserMeResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getSubscriptions().stream().map(t -> new TopicDto(t.getId(), t.getName(), t.getDescription())).toList()
                ));
            }
            user.setEmail(req.getEmail());
        }

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }

        userRepository.save(user);

        List<TopicDto> subscriptions = user.getSubscriptions()
                .stream()
                .map(t -> new TopicDto(t.getId(), t.getName(), t.getDescription()))
                .toList();

        return ResponseEntity.ok(new UserMeResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                subscriptions
        ));
    }
}
