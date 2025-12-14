package com.uca.scheduleapp.controller;

import com.uca.scheduleapp.dto.MealDTO;
import com.uca.scheduleapp.dto.MealRequest;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "*")
public class MealController {
    @Autowired
    private MealService mealService;

    @GetMapping("/")
    public ResponseEntity<List<MealDTO>> getAllMeals(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Long student_class_id) {
        try {
            List<MealDTO> meals = mealService.getAllMeals(user, student_class_id);
            return ResponseEntity.ok(meals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/{id}/")
    public ResponseEntity<MealDTO> getMealById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            MealDTO meal = mealService.getMealById(id, user);
            return ResponseEntity.ok(meal);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<MealDTO> createMeal(
            @RequestBody MealRequest request,
            @AuthenticationPrincipal User user) {
        try {
            MealDTO meal = mealService.createMeal(request, user);
            return ResponseEntity.ok(meal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/")
    public ResponseEntity<MealDTO> updateMeal(
            @PathVariable Long id,
            @RequestBody MealRequest request,
            @AuthenticationPrincipal User user) {
        try {
            MealDTO meal = mealService.updateMeal(id, request, user);
            return ResponseEntity.ok(meal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}/")
    public ResponseEntity<?> deleteMeal(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            mealService.deleteMeal(id, user);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}

