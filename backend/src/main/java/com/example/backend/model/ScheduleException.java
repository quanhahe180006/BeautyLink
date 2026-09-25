package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "schedule_exceptions", uniqueConstraints = @UniqueConstraint(name = "uk_practitioner_exception_date", columnNames = {"practitioner_id", "exception_date"}), indexes = @Index(name = "idx_exception_date", columnList = "exception_date"))
public class ScheduleException {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "practitioner_id", nullable = false) private Practitioner practitioner;
    @Column(nullable = false) private LocalDate exceptionDate;
    @Column(nullable = false) private boolean available;
    private LocalTime startTime;
    private LocalTime endTime;
    @Column(length = 255) private String reason;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Practitioner getPractitioner() { return practitioner; } public void setPractitioner(Practitioner practitioner) { this.practitioner = practitioner; }
    public LocalDate getExceptionDate() { return exceptionDate; } public void setExceptionDate(LocalDate exceptionDate) { this.exceptionDate = exceptionDate; }
    public boolean isAvailable() { return available; } public void setAvailable(boolean available) { this.available = available; }
    public LocalTime getStartTime() { return startTime; } public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; } public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public String getReason() { return reason; } public void setReason(String reason) { this.reason = reason; }
}
