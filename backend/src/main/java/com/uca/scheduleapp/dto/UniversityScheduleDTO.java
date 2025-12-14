package com.uca.scheduleapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UniversityScheduleDTO {
    private Long id;
    private String courseName;
    private String day;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private Long studentClassId;
    private String studentClassName;
}

