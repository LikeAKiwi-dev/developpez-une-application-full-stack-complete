package com.openclassrooms.mddapi.security;

import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.springframework.lang.NonNull;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
/**
 * Implémentation de {@link org.springframework.security.core.userdetails.UserDetailsService}.
 * Charge les informations d'un utilisateur à partir de l'email ou du username.
 */

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    /**
     * Charge un utilisateur à partir d'un identifiant (email ou username).
     *
     * @param login email ou username
     * @return UserDetails Spring Security
     * @throws org.springframework.security.core.userdetails.UsernameNotFoundException si l'utilisateur n'existe pas
     */
    @Override
    public UserDetails loadUserByUsername(@NonNull String login){
        User user = userRepository.findByEmailOrUsername(login, login)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPasswordHash())
                .roles("USER")
                .build();
    }
}
