package com.uca.scheduleapp.repository;

import com.uca.scheduleapp.model.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, Long> {
}

