package com.example.backend.repository;
import com.example.backend.model.Practitioner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface PractitionerRepository extends JpaRepository<Practitioner, Long> {
    List<Practitioner> findBySupplierIdAndActiveTrue(Long supplierId);
    Optional<Practitioner> findByIdAndSupplierOwnerId(Long id, Long ownerId);
}
