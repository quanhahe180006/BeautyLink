package com.example.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import java.time.DayOfWeek;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PlatformApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper objectMapper;

    @Test
    void publicCatalogExposesSeededLocationsCategoriesAndServices() throws Exception {
        String rootLocations = mvc.perform(get("/api/v1/locations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].type", is("PROVINCE_CITY")))
                .andReturn().getResponse().getContentAsString();

        mvc.perform(get("/api/v1/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)))
                .andExpect(jsonPath("$[*].slug", hasItem("makeup")));

        mvc.perform(get("/api/v1/categories/makeup/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())))
                .andExpect(jsonPath("$[0].practitioners", not(empty())));

        JsonNode roots = objectMapper.readTree(rootLocations);
        long hcmId = 0;
        long hanoiId = 0;
        for (JsonNode root : roots) {
            if ("ho-chi-minh".equals(root.path("slug").asText())) hcmId = root.path("id").asLong();
            if ("ha-noi".equals(root.path("slug").asText())) hanoiId = root.path("id").asLong();
        }
        mvc.perform(get("/api/v1/categories/makeup/services").param("locationId", Long.toString(hcmId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())));

        for (String slug : new String[]{"makeup", "hair", "spa", "nails", "skincare"}) {
            mvc.perform(get("/api/v1/categories/" + slug + "/services").param("locationId", Long.toString(hanoiId)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))))
                    .andExpect(jsonPath("$[*].supplierDemo", everyItem(is(true))));
        }

        mvc.perform(get("/api/v1/homepage/services").param("locationId", Long.toString(hcmId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(12))))
                .andExpect(jsonPath("$[*].supplierDemo", hasItem(true)))
                .andExpect(jsonPath("$[*].featured", hasItem(true)));
    }

    @Test
    void customerCanRegisterAndUseProtectedProfileEndpoint() throws Exception {
        String registerBody = """
                {"fullName":"Nguyen An","phone":"0912345678","email":"an@example.com","password":"StrongPass123!"}
                """;

        String response = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken", not(emptyString())))
                .andExpect(jsonPath("$.user.role", is("CUSTOMER")))
                .andReturn().getResponse().getContentAsString();

        JsonNode payload = objectMapper.readTree(response);
        String token = payload.path("accessToken").asText();
        mvc.perform(get("/api/v1/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phone", is("0912345678")));
    }

    @Test
    void protectedEndpointRejectsAnonymousRequests() throws Exception {
        mvc.perform(get("/api/v1/bookings/mine"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void customerCanBookAnAvailableSlotAndReadItBack() throws Exception {
        String customerToken = login("0900000001", "Demo123!");
        JsonNode services = objectMapper.readTree(mvc.perform(get("/api/v1/homepage/services"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
        long serviceId = services.get(0).path("id").asLong();
        long practitionerId = services.get(0).path("practitioners").get(0).path("id").asLong();
        LocalDate date = LocalDate.now().plusDays(1);
        while (date.getDayOfWeek() != DayOfWeek.MONDAY) date = date.plusDays(1);

        mvc.perform(post("/api/v1/bookings")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"serviceId\":" + serviceId + ",\"practitionerId\":" + practitionerId + ",\"appointmentDate\":\"" + date + "\",\"startTime\":\"09:00\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookingCode", startsWith("BL-")))
                .andExpect(jsonPath("$.paymentStatus", is("SIMULATED")));

        mvc.perform(get("/api/v1/bookings/mine").header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[*].status", hasItem("CONFIRMED")));
    }

    @Test
    void supplierCanReadAndReplaceOwnedPractitionerSchedule() throws Exception {
        String supplierToken = login("0900000002", "Demo123!");
        JsonNode people = objectMapper.readTree(mvc.perform(get("/api/v1/supplier/practitioners")
                        .header("Authorization", "Bearer " + supplierToken))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
        long practitionerId = people.get(0).path("id").asLong();

        mvc.perform(put("/api/v1/supplier/practitioners/" + practitionerId + "/schedule")
                        .header("Authorization", "Bearer " + supplierToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"rules\":[{\"dayOfWeek\":\"MONDAY\",\"startTime\":\"09:00\",\"endTime\":\"18:00\",\"breakStart\":\"12:00\",\"breakEnd\":\"13:00\",\"slotMinutes\":30,\"active\":true}]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].dayOfWeek", is("MONDAY")));
    }

    @Test
    void supplierCanRegisterAndReceivesAReadyToConfigureWorkspace() throws Exception {
        JsonNode locations = objectMapper.readTree(mvc.perform(get("/api/v1/locations"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
        long cityId = locations.get(0).path("id").asLong();
        String body = """
                {"ownerName":"Le Minh","phone":"0934567890","email":"partner.new@example.com",
                 "password":"StrongPass123!","businessName":"Minh Beauty House","businessType":"Makeup Studio",
                 "locationId":%d,"addressLine":"25 Nguyen Trai","description":"Studio trang diem",
                 "specialty":"Trang diem co dau"}
                """.formatted(cityId);

        String response = mvc.perform(post("/api/v1/auth/register-supplier")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.auth.accessToken", not(emptyString())))
                .andExpect(jsonPath("$.auth.user.role", is("SUPPLIER")))
                .andExpect(jsonPath("$.supplier.verificationStatus", is("PENDING")))
                .andReturn().getResponse().getContentAsString();
        String token = objectMapper.readTree(response).path("auth").path("accessToken").asText();

        mvc.perform(get("/api/v1/supplier/profile").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.name", is("Minh Beauty House")));
        JsonNode people = objectMapper.readTree(mvc.perform(get("/api/v1/supplier/practitioners")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(1)))
                .andReturn().getResponse().getContentAsString());
        long practitionerId = people.get(0).path("id").asLong();
        mvc.perform(get("/api/v1/supplier/practitioners/" + practitionerId + "/schedule")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(7)));
    }

    @Test
    void customerReportCanBeResolvedByStaff() throws Exception {
        String customerToken = login("0900000001", "Demo123!");
        String staffToken = login("0900000003", "Demo123!");
        String created = mvc.perform(post("/api/v1/reports")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"targetType\":\"BOOKING\",\"targetId\":999,\"reason\":\"Can ho tro\",\"details\":\"Khach hang can thay doi lich hen\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("OPEN")))
                .andReturn().getResponse().getContentAsString();
        long reportId = objectMapper.readTree(created).path("id").asLong();

        mvc.perform(patch("/api/v1/reports/" + reportId)
                        .header("Authorization", "Bearer " + staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"RESOLVED\",\"resolutionNote\":\"Da lien he khach hang\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("RESOLVED")))
                .andExpect(jsonPath("$.assignedStaffName", not(emptyString())));
    }

    private String login(String identifier, String password) throws Exception {
        String response = mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"identifier\":\"" + identifier + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(response).path("accessToken").asText();
    }
}
