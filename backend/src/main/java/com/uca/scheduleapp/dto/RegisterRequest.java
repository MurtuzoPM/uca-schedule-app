package com.uca.scheduleapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String gender;
    
    @JsonProperty("student_class")
    private Long studentClass;
    
    @JsonProperty("is_superuser")
    private Boolean isSuperuser;
    
    @JsonProperty("is_staff")
    private Boolean isStaff;
}

