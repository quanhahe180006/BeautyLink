package com.example.backend.repository;
import com.example.backend.model.Booking;
import com.example.backend.model.DomainEnums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.*;
import java.util.*;
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByAppointmentDateDescStartTimeDesc(Long customerId);
    List<Booking> findBySupplierIdOrderByAppointmentDateDescStartTimeDesc(Long supplierId);
    boolean existsByPractitionerIdAndAppointmentDateAndStartTimeAndStatusNot(Long practitionerId, LocalDate date, LocalTime startTime, BookingStatus status);
    List<Booking> findByPractitionerIdAndAppointmentDateAndStatusNot(Long practitionerId, LocalDate date, BookingStatus status);
}
