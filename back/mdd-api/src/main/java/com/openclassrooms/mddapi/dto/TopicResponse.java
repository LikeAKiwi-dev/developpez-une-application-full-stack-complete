package com.openclassrooms.mddapi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.Flow;

@Getter
@AllArgsConstructor
public class TopicResponse {
    private Long id;
    private String name;
    private String description;
    private List<UserDto> subscribers;
}
