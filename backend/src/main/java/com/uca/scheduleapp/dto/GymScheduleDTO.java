package com.uca.scheduleapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GymScheduleDTO {
    private Long id;
    private String gender;
    private String day;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime openTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime closeTime;
}
