package com.uca.scheduleapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassDTO {
    private Long id;
    private String name;
    private String yearLevel;
}

