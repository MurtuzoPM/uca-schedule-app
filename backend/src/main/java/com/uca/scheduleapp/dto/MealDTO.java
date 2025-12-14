package com.uca.scheduleapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealDTO {
    private Long id;
    private String type;
    private LocalTime timeStart;
    private LocalTime timeEnd;
    private String menu;
    private Long studentClassId;
    private String studentClassName;
}

