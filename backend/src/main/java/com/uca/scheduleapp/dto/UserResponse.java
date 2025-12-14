package com.uca.scheduleapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String gender;
    
    @JsonProperty("student_class_id")
    private Long studentClassId;
    
    @JsonProperty("student_class")
    private String studentClass;
    
    @JsonProperty("student_class_name")
    private String studentClassName;
    
    @JsonProperty("student_class_year")
    private String studentClassYear;
    
    @JsonProperty("is_superuser")
    private Boolean isSuperuser;
    
    public UserResponse(Long id, String username, String email, String gender, 
                       Long studentClassId, String studentClassName, String studentClassYear, Boolean isSuperuser) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.gender = gender;
        this.studentClassId = studentClassId;
        this.studentClass = studentClassName; // student_class is the name for display
        this.studentClassName = studentClassName; // student_class_name is also the name
        this.studentClassYear = studentClassYear;
        this.isSuperuser = isSuperuser;
    }
}
