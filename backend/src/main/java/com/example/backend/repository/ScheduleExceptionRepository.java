package com.example.backend.repository;
import com.example.backend.model.ScheduleException;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.*;
public interface ScheduleExceptionRepository extends JpaRepository<ScheduleException, Long> {
    Optional<ScheduleException> findByPractitionerIdAndExceptionDate(Long practitionerId, LocalDate date);
}
