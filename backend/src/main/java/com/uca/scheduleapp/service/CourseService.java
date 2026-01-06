package com.uca.scheduleapp.service;

import com.uca.scheduleapp.dto.CourseDTO;
import com.uca.scheduleapp.model.Course;
import com.uca.scheduleapp.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private NotificationService notificationService;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return toDTO(course);
    }

    @Transactional
    public CourseDTO createCourse(CourseDTO request) {
        Course course = new Course();
        course.setName(request.getName());
        course.setYearLevel(Course.YearLevel.valueOf(request.getYearLevel()));
        Course saved = courseRepository.save(course);
        notificationService.notifyAllUsers("COURSE_CREATED", "New course available: " + saved.getName());
        return toDTO(saved);
    }

    @Transactional
    public CourseDTO updateCourse(Long id, CourseDTO request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (request.getName() != null) {
            course.setName(request.getName());
        }
        if (request.getYearLevel() != null) {
            course.setYearLevel(Course.YearLevel.valueOf(request.getYearLevel()));
        }
        Course saved = courseRepository.save(course);
        notificationService.notifyAllUsers("COURSE_UPDATED", "Course updated: " + saved.getName());
        return toDTO(saved);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        courseRepository.delete(course);
    }

    private CourseDTO toDTO(Course course) {
        return new CourseDTO(
                course.getId(),
                course.getName(),
                course.getYearLevel().name());
    }
}
