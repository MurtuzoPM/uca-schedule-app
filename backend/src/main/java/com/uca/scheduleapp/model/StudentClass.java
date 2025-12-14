package com.uca.scheduleapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "student_class")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "year_level", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private YearLevel yearLevel;

    public enum YearLevel {
        Preparatory,
        Freshman,
        Sophomore,
        Junior,
        Senior
    }
}

