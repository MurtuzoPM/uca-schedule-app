package com.uca.scheduleapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalTime;

@Entity
@Table(name = "gym_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GymSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false, length = 20)
    private String day;

    @Column(name = "open_time", nullable = false)
    @JsonFormat(pattern = "HH:mm")
    private LocalTime openTime;

    @Column(name = "close_time", nullable = false)
    @JsonFormat(pattern = "HH:mm")
    private LocalTime closeTime;

    public enum Gender {
        Male, Female
    }
}

