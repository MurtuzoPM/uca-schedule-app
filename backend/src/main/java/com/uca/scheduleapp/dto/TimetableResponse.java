package com.uca.scheduleapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TimetableResponse {
    private List<UniversityScheduleDTO> entries;
    private List<TimetableConflictDTO> conflicts;
}
