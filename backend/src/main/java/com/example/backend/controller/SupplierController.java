package com.example.backend.controller;

import com.example.backend.dto.ApiDtos.*;
import com.example.backend.exception.ApiException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/supplier") @PreAuthorize("hasRole('SUPPLIER')")
public class SupplierController {
    private final CurrentAccountService current; private final SupplierRepository suppliers; private final PractitionerRepository practitioners; private final ScheduleService schedules; private final SupplierAccountService supplierAccounts;
    public SupplierController(CurrentAccountService current, SupplierRepository suppliers, PractitionerRepository practitioners, ScheduleService schedules, SupplierAccountService supplierAccounts) { this.current = current; this.suppliers = suppliers; this.practitioners = practitioners; this.schedules = schedules; this.supplierAccounts = supplierAccounts; }
    @GetMapping("/profile") public SupplierResponse profile(Authentication auth) { return supplierAccounts.profile(current.require(auth)); }
    @GetMapping("/practitioners") public List<PractitionerResponse> practitioners(Authentication auth) {
        UserAccount owner = current.require(auth); Supplier supplier = suppliers.findByOwnerId(owner.getId()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SUPPLIER_NOT_FOUND", "Không tìm thấy nhà cung cấp"));
        return practitioners.findBySupplierIdAndActiveTrue(supplier.getId()).stream().map(p -> new PractitionerResponse(p.getId(), p.getDisplayName(), p.getSpecialty(), p.getAvatarUrl())).toList();
    }
    @GetMapping("/practitioners/{id}/schedule") public List<ScheduleRuleResponse> schedule(Authentication auth, @PathVariable Long id) { return schedules.get(current.require(auth), id); }
    @PostMapping("/practitioners") @ResponseStatus(HttpStatus.CREATED) public PractitionerResponse createPractitioner(Authentication auth, @Valid @RequestBody CreatePractitionerRequest request) { return supplierAccounts.createPractitioner(current.require(auth), request); }
    @PutMapping("/practitioners/{id}/schedule") public List<ScheduleRuleResponse> replaceSchedule(Authentication auth, @PathVariable Long id, @Valid @RequestBody ReplaceScheduleRequest request) { return schedules.replace(current.require(auth), id, request); }
}
