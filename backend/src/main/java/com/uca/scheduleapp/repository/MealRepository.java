package com.uca.scheduleapp.repository;

import com.uca.scheduleapp.model.Meal;
import com.uca.scheduleapp.model.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByStudentClass(StudentClass studentClass);
    List<Meal> findByStudentClassId(Long studentClassId);
}

