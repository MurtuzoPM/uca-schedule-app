package com.uca.scheduleapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.uca.scheduleapp.dto.TimetableResponse;
import com.uca.scheduleapp.dto.UniversityScheduleDTO;
import com.uca.scheduleapp.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Autowired
    private TimetableService timetableService;

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${ai.model:gpt-3.5-turbo}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String chat(User user, String userMessage) {
        TimetableResponse timetable = timetableService.getMyTimetable(user);
        String scheduleContext = formatScheduleForAI(timetable, user);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content",
                "You are a helpful university schedule assistant. " +
                        "Current Date: " + LocalDate.now() + ". " +
                        "Here is the student's schedule: " + scheduleContext + ". " +
                        "Answer the student's questions based on this schedule. Keep answers concise."));
        messages.add(Map.of("role", "user", "content", userMessage));

        requestBody.put("messages", messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I am having trouble connecting to my brain right now. Please try again later. (Error: "
                    + e.getMessage() + ")";
        }
    }

    private String formatScheduleForAI(TimetableResponse timetable, User user) {
        if (timetable.getEntries().isEmpty()) {
            return "The user has no classes in their timetable.";
        }
        StringBuilder sb = new StringBuilder();
        for (UniversityScheduleDTO entry : timetable.getEntries()) {
            sb.append(String.format("[%s] %s at %s (%s-%s), Location: %s. ",
                    entry.getDay(),
                    entry.getCourseName(),
                    entry.getStartTime(),
                    entry.getEndTime(),
                    entry.getLocation()));
        }
        return sb.toString();
    }
}
