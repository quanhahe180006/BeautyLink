package com.example.backend.model;

import jakarta.persistence.*;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "availability_rules", uniqueConstraints = @UniqueConstraint(name = "uk_practitioner_day", columnNames = {"practitioner_id", "day_of_week"}), indexes = @Index(name = "idx_availability_practitioner", columnList = "practitioner_id"))
public class AvailabilityRule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "practitioner_id", nullable = false) private Practitioner practitioner;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 12) private DayOfWeek dayOfWeek;
    @Column(nullable = false) private LocalTime startTime;
    @Column(nullable = false) private LocalTime endTime;
    private LocalTime breakStart;
    private LocalTime breakEnd;
    @Column(nullable = false) private int slotMinutes = 30;
    @Column(nullable = false) private boolean active = true;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Practitioner getPractitioner() { return practitioner; } public void setPractitioner(Practitioner practitioner) { this.practitioner = practitioner; }
    public DayOfWeek getDayOfWeek() { return dayOfWeek; } public void setDayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public LocalTime getStartTime() { return startTime; } public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; } public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public LocalTime getBreakStart() { return breakStart; } public void setBreakStart(LocalTime breakStart) { this.breakStart = breakStart; }
    public LocalTime getBreakEnd() { return breakEnd; } public void setBreakEnd(LocalTime breakEnd) { this.breakEnd = breakEnd; }
    public int getSlotMinutes() { return slotMinutes; } public void setSlotMinutes(int slotMinutes) { this.slotMinutes = slotMinutes; }
    public boolean isActive() { return active; } public void setActive(boolean active) { this.active = active; }
}
