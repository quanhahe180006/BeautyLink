package com.example.backend.repository;
import com.example.backend.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByActiveTrueOrderByNameAsc();
    List<Location> findByParentIdAndActiveTrueOrderByNameAsc(Long parentId);
    Optional<Location> findBySlug(String slug);
}
