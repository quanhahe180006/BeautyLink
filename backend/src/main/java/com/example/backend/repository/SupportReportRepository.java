package com.example.backend.repository;
import com.example.backend.model.SupportReport;
import com.example.backend.model.DomainEnums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface SupportReportRepository extends JpaRepository<SupportReport, Long> {
    List<SupportReport> findAllByOrderByCreatedAtDesc();
    List<SupportReport> findByStatusOrderByCreatedAtDesc(ReportStatus status);
}
