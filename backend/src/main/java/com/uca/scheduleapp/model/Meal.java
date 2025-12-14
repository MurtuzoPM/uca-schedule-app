package com.uca.scheduleapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "meal")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_class_id", nullable = false)
    private StudentClass studentClass;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private MealType type;

    @Column(name = "time_start", nullable = false)
    private LocalTime timeStart;

    @Column(name = "time_end", nullable = false)
    private LocalTime timeEnd;

    @Column(columnDefinition = "TEXT")
    private String menu;

    public enum MealType {
        breakfast, lunch, dinner
    }
}

