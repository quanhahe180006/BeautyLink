package com.example.backend.repository;
import com.example.backend.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByOwnerId(Long ownerId);
    Optional<Supplier> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
