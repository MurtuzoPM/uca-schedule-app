package com.uca.scheduleapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "university_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UniversitySchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_class_id", nullable = false)
    private StudentClass studentClass;

    @Column(name = "course_name", nullable = false, length = 100)
    private String courseName;

    @Column(nullable = false, length = 20)
    private String day;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, length = 100)
    private String location;
}

