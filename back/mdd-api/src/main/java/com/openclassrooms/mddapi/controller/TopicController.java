package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.TopicResponse;
import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.service.TopicService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @GetMapping
    public List<TopicResponse> getAll() {
        return topicService.findAll()
                .stream()
                .map(t -> new TopicResponse(
                        t.getId(),
                        t.getName(),
                        t.getSubscribers()
                                .stream()
                                .map(u -> new UserDto(u.getId(), u.getUsername()))
                                .toList()
                ))
                .toList();
    }
}
