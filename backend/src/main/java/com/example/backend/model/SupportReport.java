package com.example.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import static com.example.backend.model.DomainEnums.*;

@Entity
@Table(name = "support_reports", indexes = {@Index(name = "idx_report_status", columnList = "status"), @Index(name = "idx_report_assignee", columnList = "assigned_staff_id")})
public class SupportReport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "reporter_id", nullable = false) private UserAccount reporter;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private ReportTargetType targetType;
    @Column(nullable = false) private Long targetId;
    @Column(nullable = false, length = 120) private String reason;
    @Column(nullable = false, length = 1500) private String details;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private ReportStatus status = ReportStatus.OPEN;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "assigned_staff_id") private UserAccount assignedStaff;
    @Column(length = 1000) private String resolutionNote;
    @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();
    private Instant resolvedAt;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public UserAccount getReporter() { return reporter; } public void setReporter(UserAccount reporter) { this.reporter = reporter; }
    public ReportTargetType getTargetType() { return targetType; } public void setTargetType(ReportTargetType targetType) { this.targetType = targetType; }
    public Long getTargetId() { return targetId; } public void setTargetId(Long targetId) { this.targetId = targetId; }
    public String getReason() { return reason; } public void setReason(String reason) { this.reason = reason; }
    public String getDetails() { return details; } public void setDetails(String details) { this.details = details; }
    public ReportStatus getStatus() { return status; } public void setStatus(ReportStatus status) { this.status = status; }
    public UserAccount getAssignedStaff() { return assignedStaff; } public void setAssignedStaff(UserAccount assignedStaff) { this.assignedStaff = assignedStaff; }
    public String getResolutionNote() { return resolutionNote; } public void setResolutionNote(String resolutionNote) { this.resolutionNote = resolutionNote; }
    public Instant getCreatedAt() { return createdAt; } public Instant getResolvedAt() { return resolvedAt; } public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
}
