package com.example.backend.repository;
import com.example.backend.model.AvailabilityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.DayOfWeek;
import java.util.*;
public interface AvailabilityRuleRepository extends JpaRepository<AvailabilityRule, Long> {
    List<AvailabilityRule> findByPractitionerIdOrderByDayOfWeek(Long practitionerId);
    Optional<AvailabilityRule> findByPractitionerIdAndDayOfWeekAndActiveTrue(Long practitionerId, DayOfWeek dayOfWeek);
    void deleteByPractitionerId(Long practitionerId);
}
