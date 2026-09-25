package com.example.backend.service;

import com.example.backend.dto.ApiDtos.AvailabilityResponse;
import com.example.backend.exception.ApiException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;

@Service
public class AvailabilityService {
    private static final int BOOKING_WINDOW_MONTHS = 1;
    private final PractitionerRepository practitioners; private final ServiceOfferingRepository services;
    private final AvailabilityRuleRepository rules; private final ScheduleExceptionRepository exceptions; private final BookingRepository bookings;
    public AvailabilityService(PractitionerRepository practitioners, ServiceOfferingRepository services, AvailabilityRuleRepository rules, ScheduleExceptionRepository exceptions, BookingRepository bookings) {
        this.practitioners = practitioners; this.services = services; this.rules = rules; this.exceptions = exceptions; this.bookings = bookings;
    }
    public AvailabilityResponse availability(Long serviceId, Long practitionerId, LocalDate date) {
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) throw new ApiException(HttpStatus.BAD_REQUEST, "PAST_DATE", "Không thể đặt lịch trong quá khứ");
        if (date.isAfter(today.plusMonths(BOOKING_WINDOW_MONTHS))) throw new ApiException(HttpStatus.BAD_REQUEST, "DATE_TOO_FAR", "Chỉ có thể đặt lịch trước tối đa 1 tháng");
        ServiceOffering service = services.findById(serviceId).filter(ServiceOffering::isActive).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SERVICE_NOT_FOUND", "Không tìm thấy dịch vụ"));
        Practitioner practitioner = practitioners.findById(practitionerId).filter(Practitioner::isActive).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PRACTITIONER_NOT_FOUND", "Không tìm thấy chuyên viên"));
        if (!practitioner.getSupplier().getId().equals(service.getSupplier().getId())) throw new ApiException(HttpStatus.BAD_REQUEST, "PRACTITIONER_MISMATCH", "Chuyên viên không cung cấp dịch vụ này");
        ScheduleException exception = exceptions.findByPractitionerIdAndExceptionDate(practitionerId, date).orElse(null);
        if (exception != null && !exception.isAvailable()) return new AvailabilityResponse(practitionerId, date, List.of());
        AvailabilityRule rule = rules.findByPractitionerIdAndDayOfWeekAndActiveTrue(practitionerId, date.getDayOfWeek()).orElse(null);
        if (rule == null && exception == null) return new AvailabilityResponse(practitionerId, date, List.of());
        LocalTime start = exception != null && exception.getStartTime() != null ? exception.getStartTime() : rule.getStartTime();
        LocalTime end = exception != null && exception.getEndTime() != null ? exception.getEndTime() : rule.getEndTime();
        int step = rule == null ? 30 : rule.getSlotMinutes();
        List<Booking> booked = bookings.findByPractitionerIdAndAppointmentDateAndStatusNot(practitionerId, date, com.example.backend.model.DomainEnums.BookingStatus.CANCELLED);
        List<LocalTime> slots = new ArrayList<>();
        for (LocalTime cursor = start; !cursor.plusMinutes(service.getDurationMinutes()).isAfter(end); cursor = cursor.plusMinutes(step)) {
            LocalTime slotStart = cursor;
            LocalTime slotEnd = slotStart.plusMinutes(service.getDurationMinutes());
            boolean duringBreak = rule != null && rule.getBreakStart() != null && rule.getBreakEnd() != null && slotStart.isBefore(rule.getBreakEnd()) && slotEnd.isAfter(rule.getBreakStart());
            boolean overlaps = booked.stream().anyMatch(b -> slotStart.isBefore(b.getEndTime()) && slotEnd.isAfter(b.getStartTime()));
            boolean alreadyPast = date.equals(today) && slotStart.isBefore(LocalTime.now().plusMinutes(30));
            if (!duringBreak && !overlaps && !alreadyPast) slots.add(slotStart);
        }
        return new AvailabilityResponse(practitionerId, date, slots);
    }
}
