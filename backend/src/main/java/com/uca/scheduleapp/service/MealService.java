package com.uca.scheduleapp.service;

import com.uca.scheduleapp.dto.MealDTO;
import com.uca.scheduleapp.dto.MealRequest;
import com.uca.scheduleapp.model.Meal;
import com.uca.scheduleapp.model.StudentClass;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.repository.MealRepository;
import com.uca.scheduleapp.repository.StudentClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MealService {
    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private StudentClassRepository studentClassRepository;

    public List<MealDTO> getAllMeals(User user, Long studentClassId) {
        List<Meal> meals;
        if (Boolean.TRUE.equals(user.getIsSuperuser())) {
            if (studentClassId != null) {
                meals = mealRepository.findByStudentClassId(studentClassId);
            } else {
                meals = mealRepository.findAll();
            }
        } else {
            if (user.getStudentClass() != null) {
                meals = mealRepository.findByStudentClass(user.getStudentClass());
            } else {
                meals = List.of();
            }
        }
        return meals.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MealDTO getMealById(Long id, User user) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found"));
        
        if (!Boolean.TRUE.equals(user.getIsSuperuser()) && 
            (user.getStudentClass() == null || !meal.getStudentClass().getId().equals(user.getStudentClass().getId()))) {
            throw new RuntimeException("Access denied");
        }
        
        return toDTO(meal);
    }

    @Transactional
    public MealDTO createMeal(MealRequest request, User user) {
        if (Boolean.TRUE.equals(user.getIsSuperuser())) {
            if (request.getStudentClassIds() == null || request.getStudentClassIds().isEmpty()) {
                throw new RuntimeException("Admin must specify at least one Student Class ID");
            }
            
            Meal firstMeal = null;
            for (Long classId : request.getStudentClassIds()) {
                StudentClass studentClass = studentClassRepository.findById(classId)
                        .orElseThrow(() -> new RuntimeException("Student class with ID " + classId + " does not exist"));
                
                Meal meal = new Meal();
                meal.setStudentClass(studentClass);
                meal.setType(Meal.MealType.valueOf(request.getType()));
                meal.setTimeStart(request.getTimeStart());
                meal.setTimeEnd(request.getTimeEnd());
                meal.setMenu(request.getMenu());
                
                if (firstMeal == null) {
                    firstMeal = mealRepository.save(meal);
                } else {
                    mealRepository.save(meal);
                }
            }
            return toDTO(firstMeal);
        } else {
            if (user.getStudentClass() == null) {
                throw new RuntimeException("You must have a class assigned to add meals");
            }
            Meal meal = new Meal();
            meal.setStudentClass(user.getStudentClass());
            meal.setType(Meal.MealType.valueOf(request.getType()));
            meal.setTimeStart(request.getTimeStart());
            meal.setTimeEnd(request.getTimeEnd());
            meal.setMenu(request.getMenu());
            return toDTO(mealRepository.save(meal));
        }
    }

    @Transactional
    public MealDTO updateMeal(Long id, MealRequest request, User user) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found"));
        
        if (!Boolean.TRUE.equals(user.getIsSuperuser())) {
            throw new RuntimeException("Access denied");
        }
        
        if (request.getType() != null) {
            meal.setType(Meal.MealType.valueOf(request.getType()));
        }
        if (request.getTimeStart() != null) {
            meal.setTimeStart(request.getTimeStart());
        }
        if (request.getTimeEnd() != null) {
            meal.setTimeEnd(request.getTimeEnd());
        }
        if (request.getMenu() != null) {
            meal.setMenu(request.getMenu());
        }
        
        return toDTO(mealRepository.save(meal));
    }

    @Transactional
    public void deleteMeal(Long id, User user) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found"));
        
        if (!Boolean.TRUE.equals(user.getIsSuperuser())) {
            throw new RuntimeException("Access denied");
        }
        
        mealRepository.delete(meal);
    }

    private MealDTO toDTO(Meal meal) {
        return new MealDTO(
            meal.getId(),
            meal.getType().name(),
            meal.getTimeStart(),
            meal.getTimeEnd(),
            meal.getMenu(),
            meal.getStudentClass().getId(),
            meal.getStudentClass().getName()
        );
    }
}

