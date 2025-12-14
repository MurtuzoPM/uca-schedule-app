package com.uca.scheduleapp.dto;

import lombok.Data;

import java.util.List;

@Data
public class TimetableUpdateRequest {
    private List<Long> scheduleIds;
}
