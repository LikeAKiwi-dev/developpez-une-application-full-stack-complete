package com.openclassrooms.mddapi.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateMeRequest {
    private String username;
    private String email;
    private String password;
}
