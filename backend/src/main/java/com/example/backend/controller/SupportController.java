package com.example.backend.controller;

import com.example.backend.dto.ApiDtos.*;
import com.example.backend.service.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/reports")
public class SupportController {
    private final SupportService reports; private final CurrentAccountService current;
    public SupportController(SupportService reports, CurrentAccountService current) { this.reports = reports; this.current = current; }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public ReportResponse create(Authentication auth, @Valid @RequestBody CreateReportRequest request) { return reports.create(current.require(auth), request); }
    @GetMapping @PreAuthorize("hasAnyRole('STAFF','ADMIN')") public List<ReportResponse> list() { return reports.list(); }
    @PatchMapping("/{id}") @PreAuthorize("hasAnyRole('STAFF','ADMIN')") public ReportResponse update(Authentication auth, @PathVariable Long id, @Valid @RequestBody UpdateReportRequest request) { return reports.update(current.require(auth), id, request); }
}
