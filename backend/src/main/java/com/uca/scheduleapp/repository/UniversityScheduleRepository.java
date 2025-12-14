package com.uca.scheduleapp.repository;

import com.uca.scheduleapp.model.StudentClass;
import com.uca.scheduleapp.model.UniversitySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface UniversityScheduleRepository extends JpaRepository<UniversitySchedule, Long> {
    List<UniversitySchedule> findByStudentClass(StudentClass studentClass);
    List<UniversitySchedule> findByStudentClassId(Long studentClassId);
    
    @Query("SELECT u FROM UniversitySchedule u WHERE u.studentClass = :studentClass " +
           "AND u.day = :day AND u.startTime < :endTime AND u.endTime > :startTime")
    List<UniversitySchedule> findOverlappingSchedules(
        @Param("studentClass") StudentClass studentClass,
        @Param("day") String day,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );
}

