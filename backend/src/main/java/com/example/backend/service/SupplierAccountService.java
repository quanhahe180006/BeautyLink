package com.example.backend.service;

import com.example.backend.dto.ApiDtos.*;
import com.example.backend.exception.ApiException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;

import static com.example.backend.model.DomainEnums.*;

@Service
public class SupplierAccountService {
    private static final List<String> SUPPORTED_CITIES = List.of("ha-noi", "ho-chi-minh");
    private final UserAccountRepository users;
    private final SupplierRepository suppliers;
    private final LocationRepository locations;
    private final PractitionerRepository practitioners;
    private final AvailabilityRuleRepository rules;
    private final PasswordEncoder encoder;
    private final AuthService auth;

    public SupplierAccountService(UserAccountRepository users, SupplierRepository suppliers, LocationRepository locations,
                                  PractitionerRepository practitioners, AvailabilityRuleRepository rules,
                                  PasswordEncoder encoder, AuthService auth) {
        this.users = users;
        this.suppliers = suppliers;
        this.locations = locations;
        this.practitioners = practitioners;
        this.rules = rules;
        this.encoder = encoder;
        this.auth = auth;
    }

    @Transactional
    public SupplierRegistrationResponse register(SupplierRegistrationRequest request) {
        String phone = AuthService.normalizePhone(request.phone());
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (users.existsByPhone(phone)) throw new ApiException(HttpStatus.CONFLICT, "PHONE_EXISTS", "Số điện thoại đã được đăng ký");
        if (users.existsByEmailIgnoreCase(email)) throw new ApiException(HttpStatus.CONFLICT, "EMAIL_EXISTS", "Email đã được đăng ký");

        Location city = locations.findById(request.locationId())
                .filter(location -> location.isActive() && location.getType() == LocationType.PROVINCE_CITY && SUPPORTED_CITIES.contains(location.getSlug()))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "UNSUPPORTED_CITY", "BeautyLink hiện chỉ hỗ trợ Hà Nội và TP. Hồ Chí Minh"));

        UserAccount owner = new UserAccount();
        owner.setFullName(request.ownerName().trim());
        owner.setPhone(phone);
        owner.setEmail(email);
        owner.setPasswordHash(encoder.encode(request.password()));
        owner.setRole(Role.SUPPLIER);
        owner.setStatus(AccountStatus.ACTIVE);
        users.save(owner);

        Supplier supplier = new Supplier();
        supplier.setOwner(owner);
        supplier.setName(request.businessName().trim());
        supplier.setSlug(uniqueSlug(request.businessName()));
        supplier.setBusinessType(request.businessType().trim());
        supplier.setDescription(blankToNull(request.description()));
        supplier.setLocation(city);
        supplier.setAddressLine(request.addressLine().trim());
        supplier.setVerificationStatus(VerificationStatus.PENDING);
        suppliers.save(supplier);

        Practitioner practitioner = new Practitioner();
        practitioner.setSupplier(supplier);
        practitioner.setUser(owner);
        practitioner.setDisplayName(owner.getFullName());
        practitioner.setSpecialty(request.specialty() == null || request.specialty().isBlank() ? request.businessType().trim() : request.specialty().trim());
        practitioners.save(practitioner);
        createDefaultSchedule(practitioner);

        return new SupplierRegistrationResponse(auth.response(owner), response(supplier));
    }

    @Transactional(readOnly = true)
    public SupplierResponse profile(UserAccount owner) {
        return response(requireSupplier(owner));
    }

    @Transactional
    public PractitionerResponse createPractitioner(UserAccount owner, CreatePractitionerRequest request) {
        Supplier supplier = requireSupplier(owner);
        Practitioner practitioner = new Practitioner();
        practitioner.setSupplier(supplier);
        practitioner.setDisplayName(request.displayName().trim());
        practitioner.setSpecialty(blankToNull(request.specialty()));
        practitioner.setBio(blankToNull(request.bio()));
        practitioner.setAvatarUrl(blankToNull(request.avatarUrl()));
        practitioners.save(practitioner);
        createDefaultSchedule(practitioner);
        return new PractitionerResponse(practitioner.getId(), practitioner.getDisplayName(), practitioner.getSpecialty(), practitioner.getAvatarUrl());
    }

    private Supplier requireSupplier(UserAccount owner) {
        return suppliers.findByOwnerId(owner.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SUPPLIER_NOT_FOUND", "Không tìm thấy hồ sơ nhà cung cấp"));
    }

    private void createDefaultSchedule(Practitioner practitioner) {
        for (DayOfWeek day : DayOfWeek.values()) {
            AvailabilityRule rule = new AvailabilityRule();
            rule.setPractitioner(practitioner);
            rule.setDayOfWeek(day);
            rule.setStartTime(LocalTime.of(9, 0));
            rule.setEndTime(LocalTime.of(18, 0));
            rule.setBreakStart(LocalTime.of(12, 0));
            rule.setBreakEnd(LocalTime.of(13, 0));
            rule.setSlotMinutes(30);
            rule.setActive(day != DayOfWeek.SUNDAY);
            rules.save(rule);
        }
    }

    private SupplierResponse response(Supplier supplier) {
        Location location = supplier.getLocation();
        return new SupplierResponse(supplier.getId(), supplier.getName(), supplier.getSlug(), supplier.getBusinessType(),
                supplier.getDescription(), location == null ? null : location.getId(), location == null ? null : location.getName(),
                supplier.getAddressLine(), supplier.getVerificationStatus(), supplier.getRating(), supplier.getReviewCount());
    }

    private String uniqueSlug(String value) {
        String base = Normalizer.normalize(value.trim().toLowerCase(Locale.ROOT).replace('đ', 'd'), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        if (base.isBlank()) base = "supplier";
        String candidate = base;
        int suffix = 2;
        while (suppliers.existsBySlug(candidate)) candidate = base + "-" + suffix++;
        return candidate;
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
