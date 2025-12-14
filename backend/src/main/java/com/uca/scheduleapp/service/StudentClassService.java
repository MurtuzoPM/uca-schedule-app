package com.uca.scheduleapp.service;

import com.uca.scheduleapp.dto.StudentClassDTO;
import com.uca.scheduleapp.model.StudentClass;
import com.uca.scheduleapp.repository.StudentClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentClassService {
    @Autowired
    private StudentClassRepository studentClassRepository;

    public List<StudentClassDTO> getAllStudentClasses() {
        return studentClassRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public StudentClassDTO getStudentClassById(Long id) {
        StudentClass studentClass = studentClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student class not found"));
        return toDTO(studentClass);
    }

    @Transactional
    public StudentClassDTO createStudentClass(StudentClassDTO request) {
        StudentClass studentClass = new StudentClass();
        studentClass.setName(request.getName());
        studentClass.setYearLevel(StudentClass.YearLevel.valueOf(request.getYearLevel()));
        return toDTO(studentClassRepository.save(studentClass));
    }

    @Transactional
    public StudentClassDTO updateStudentClass(Long id, StudentClassDTO request) {
        StudentClass studentClass = studentClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student class not found"));
        if (request.getName() != null) {
            studentClass.setName(request.getName());
        }
        if (request.getYearLevel() != null) {
            studentClass.setYearLevel(StudentClass.YearLevel.valueOf(request.getYearLevel()));
        }
        return toDTO(studentClassRepository.save(studentClass));
    }

    @Transactional
    public void deleteStudentClass(Long id) {
        StudentClass studentClass = studentClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student class not found"));
        studentClassRepository.delete(studentClass);
    }

    private StudentClassDTO toDTO(StudentClass studentClass) {
        return new StudentClassDTO(
            studentClass.getId(),
            studentClass.getName(),
            studentClass.getYearLevel().name()
        );
    }
}

