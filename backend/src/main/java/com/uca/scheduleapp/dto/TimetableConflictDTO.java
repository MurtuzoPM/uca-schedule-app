package com.uca.scheduleapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TimetableConflictDTO {
    private String day;
    private Long firstScheduleId;
    private Long secondScheduleId;
    private String message;
}
