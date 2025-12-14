package com.uca.scheduleapp.repository;

import com.uca.scheduleapp.model.GymSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface GymScheduleRepository extends JpaRepository<GymSchedule, Long> {
    List<GymSchedule> findByGender(GymSchedule.Gender gender);
    
    @Query("SELECT g FROM GymSchedule g WHERE g.gender = :gender AND g.day = :day " +
           "AND g.openTime < :endTime AND g.closeTime > :startTime")
    List<GymSchedule> findOverlappingSchedules(
        @Param("gender") GymSchedule.Gender gender,
        @Param("day") String day,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );
}

