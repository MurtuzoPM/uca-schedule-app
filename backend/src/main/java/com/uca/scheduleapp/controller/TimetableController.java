package com.uca.scheduleapp.controller;

import com.uca.scheduleapp.dto.TimetableResponse;
import com.uca.scheduleapp.dto.TimetableUpdateRequest;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.service.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/timetable")
@CrossOrigin
public class TimetableController {
    @Autowired
    private TimetableService timetableService;

    @GetMapping("/")
    public ResponseEntity<TimetableResponse> getMyTimetable(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(timetableService.getMyTimetable(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<TimetableResponse> updateMyTimetable(
        @AuthenticationPrincipal User user,
        @RequestBody TimetableUpdateRequest request
    ) {
        try {
            return ResponseEntity.ok(timetableService.updateMyTimetable(user, request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping(value = "/ics/", produces = "text/calendar")
    public ResponseEntity<String> exportIcs(@AuthenticationPrincipal User user) {
        try {
            String ics = timetableService.exportMyTimetableAsIcs(user);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=uca_timetable.ics")
                .contentType(MediaType.parseMediaType("text/calendar"))
                .body(ics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
