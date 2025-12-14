package com.uca.scheduleapp.dto;

import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class UniversityScheduleRequest {
    private String courseName;
    private String day;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private List<Long> studentClassIds;
}

