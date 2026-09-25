package com.example.backend.repository;
import com.example.backend.model.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {
    List<ServiceCategory> findByActiveTrueOrderByDisplayOrderAsc();
    Optional<ServiceCategory> findBySlug(String slug);
    Optional<ServiceCategory> findBySlugAndActiveTrue(String slug);
}
