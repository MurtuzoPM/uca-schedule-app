package com.uca.scheduleapp.dto;

import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class MealRequest {
    private String type;
    private LocalTime timeStart;
    private LocalTime timeEnd;
    private String menu;
    private List<Long> studentClassIds;
}

