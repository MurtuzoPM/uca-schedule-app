package com.uca.scheduleapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "course")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
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

