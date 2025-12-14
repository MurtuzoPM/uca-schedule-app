package com.uca.scheduleapp.repository;

import com.uca.scheduleapp.model.TimetableSelection;
import com.uca.scheduleapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableSelectionRepository extends JpaRepository<TimetableSelection, Long> {
    List<TimetableSelection> findByUser(User user);
    void deleteByUser(User user);
}
