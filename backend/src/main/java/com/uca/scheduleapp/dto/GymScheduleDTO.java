package com.uca.scheduleapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GymScheduleDTO {
    private Long id;
    private String gender;
    private String day;
    private LocalTime openTime;
    private LocalTime closeTime;
}

