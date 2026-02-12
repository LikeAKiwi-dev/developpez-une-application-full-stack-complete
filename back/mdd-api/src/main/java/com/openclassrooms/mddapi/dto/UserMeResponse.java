package com.openclassrooms.mddapi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class UserMeResponse {
    private Long id;
    private String username;
    private String email;
    private List<TopicDto> subscriptions;
}
