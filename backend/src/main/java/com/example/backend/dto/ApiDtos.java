package com.example.backend.dto;

import com.example.backend.model.DomainEnums.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.List;

public final class ApiDtos {
    private ApiDtos() {}

    public record RegisterRequest(
            @NotBlank @Size(min = 2, max = 120) String fullName,
            @NotBlank @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$") String phone,
            @Email String email,
            @NotBlank @Size(min = 8, max = 72) String password) {}
    public record LoginRequest(@NotBlank String identifier, @NotBlank String password) {}
    public record UserResponse(Long id, String fullName, String phone, String email, Role role, int loyaltyPoints) {}
    public record AuthResponse(String accessToken, String tokenType, long expiresInMs, UserResponse user) {}
    public record SupplierRegistrationRequest(
            @NotBlank @Size(min = 2, max = 120) String ownerName,
            @NotBlank @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$") String phone,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 72) String password,
            @NotBlank @Size(min = 2, max = 160) String businessName,
            @NotBlank @Size(max = 120) String businessType,
            @NotNull Long locationId,
            @NotBlank @Size(max = 255) String addressLine,
            @Size(max = 1500) String description,
            @Size(max = 160) String specialty) {}
    public record SupplierResponse(Long id, String name, String slug, String businessType, String description,
                                   Long locationId, String locationName, String addressLine,
                                   VerificationStatus verificationStatus, double rating, int reviewCount) {}
    public record SupplierRegistrationResponse(AuthResponse auth, SupplierResponse supplier) {}

    public record LocationResponse(Long id, String name, String slug, LocationType type, Long parentId) {}
    public record CategoryResponse(Long id, String slug, String name, String description, String imageUrl) {}
    public record PractitionerResponse(Long id, String displayName, String specialty, String avatarUrl) {}
    public record CreatePractitionerRequest(@NotBlank @Size(max = 120) String displayName,
                                            @Size(max = 160) String specialty,
                                            @Size(max = 500) String bio,
                                            @Size(max = 600) String avatarUrl) {}
    public record ServiceResponse(Long id, String name, String description, BigDecimal price, int durationMinutes,
                                  String imageUrl, String categorySlug, Long supplierId, String supplierName,
                                  String supplierAddress, double rating, List<PractitionerResponse> practitioners,
                                  BigDecimal originalPrice, String highlightText, boolean featured,
                                  String supplierImageUrl, String supplierBusinessType, int supplierReviewCount,
                                  boolean supplierDemo, boolean supplierNearbyFeatured, boolean supplierNewPartner) {}
    public record AvailabilityResponse(Long practitionerId, LocalDate date, List<LocalTime> availableSlots) {}

    public record CreateBookingRequest(
            @NotNull Long serviceId,
            @NotNull Long practitionerId,
            @NotNull @FutureOrPresent LocalDate appointmentDate,
            @NotNull LocalTime startTime,
            @Size(max = 500) String note) {}
    public record BookingResponse(Long id, String bookingCode, String serviceName, String supplierName,
                                  String practitionerName, LocalDate appointmentDate, LocalTime startTime,
                                  LocalTime endTime, BigDecimal totalAmount, BookingStatus status,
                                  PaymentStatus paymentStatus) {}

    public record ScheduleRuleRequest(
            @NotNull DayOfWeek dayOfWeek,
            @NotNull LocalTime startTime,
            @NotNull LocalTime endTime,
            LocalTime breakStart,
            LocalTime breakEnd,
            @Min(15) @Max(240) int slotMinutes,
            boolean active) {}
    public record ReplaceScheduleRequest(@NotEmpty List<@Valid ScheduleRuleRequest> rules) {}
    public record ScheduleRuleResponse(Long id, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime,
                                       LocalTime breakStart, LocalTime breakEnd, int slotMinutes, boolean active) {}

    public record CreateReportRequest(@NotNull ReportTargetType targetType, @NotNull Long targetId,
                                      @NotBlank @Size(max = 120) String reason,
                                      @NotBlank @Size(max = 1500) String details) {}
    public record UpdateReportRequest(@NotNull ReportStatus status, @Size(max = 1000) String resolutionNote) {}
    public record ReportResponse(Long id, ReportTargetType targetType, Long targetId, String reason, String details,
                                 ReportStatus status, String reporterName, String assignedStaffName,
                                 String resolutionNote, Instant createdAt) {}
}
