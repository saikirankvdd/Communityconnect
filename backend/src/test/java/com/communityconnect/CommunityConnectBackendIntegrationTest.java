package com.communityconnect;

import com.communityconnect.model.*;
import com.communityconnect.repository.*;
import com.communityconnect.service.*;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.PostgreSQLContainer;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CommunityConnectBackendIntegrationTest {

    private static PostgreSQLContainer<?> postgres;
    private static boolean isDockerAvailable = false;

    @BeforeAll
    static void initContainer() {
        try {
            if (DockerClientFactory.instance().isDockerAvailable()) {
                postgres = new PostgreSQLContainer<>("postgres:16-alpine")
                        .withDatabaseName("communityconnect_test")
                        .withUsername("testuser")
                        .withPassword("testpass");
                postgres.start();
                isDockerAvailable = true;
            }
        } catch (Exception e) {
            isDockerAvailable = false;
        }
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        if (isDockerAvailable && postgres != null && postgres.isRunning()) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl);
            registry.add("spring.datasource.username", postgres::getUsername);
            registry.add("spring.datasource.password", postgres::getPassword);
            registry.add("spring.datasource.driver-class-name", () -> "org.postgresql.Driver");
            registry.add("spring.jpa.properties.hibernate.dialect", () -> "org.hibernate.dialect.PostgreSQLDialect");
        } else {
            registry.add("spring.datasource.url", () -> "jdbc:h2:mem:communityconnect_test;DB_CLOSE_DELAY=-1;MODE=PostgreSQL");
            registry.add("spring.datasource.username", () -> "sa");
            registry.add("spring.datasource.password", () -> "");
            registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
            registry.add("spring.jpa.properties.hibernate.dialect", () -> "org.hibernate.dialect.H2Dialect");
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuthService authService;

    @Autowired
    private CommunityService communityService;

    @Autowired
    private OccupancyService occupancyService;

    @Autowired
    private ServicePoolService poolService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private OccupancyConflictRepository conflictRepository;

    @Autowired
    private GroupDemandPoolRepository poolRepository;

    @Test
    @DisplayName("1 & 2. Authentication & Authorization - Register & Login Flow")
    void testAuthAndAuthorization() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "fullName": "Integration Test User",
                        "email": "integration.test@communityconnect.com",
                        "password": "password123",
                        "role": "RESIDENT",
                        "communityId": "comm-bhooja"
                    }
                """))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "email": "integration.test@communityconnect.com",
                        "password": "password123"
                    }
                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(header().exists("Set-Cookie"));
    }

    @Test
    @DisplayName("3 & 11. Community Isolation & Community Suspension")
    void testCommunityIsolationAndSuspension() {
        Community updated = communityService.updateSubscriptionStatus("comm-saket", "SUSPENDED");
        assertEquals("SUSPENDED", updated.getSubscriptionStatus());
        assertThrows(Exception.class, () -> communityService.validateCommunityAccess(updated));
    }

    @Test
    @DisplayName("4. Occupancy Conflict & Resolution Workflow")
    void testOccupancyConflictWorkflow() {
        assertThrows(Exception.class, () -> {
            occupancyService.registerOccupancy("flat-bhooja-a101", "user-resident-ananya", "Conflict Family", "TENANT");
        });

        var conflicts = conflictRepository.findByFlatId("flat-bhooja-a101");
        assertFalse(conflicts.isEmpty(), "Conflict ticket should be persisted in database");
        OccupancyConflict conflict = conflicts.get(0);
        assertEquals("PENDING_VERIFICATION", conflict.getStatus());

        occupancyService.submitSecurityReport(conflict.getId(), "user-security-bhooja", "Physical verification completed.");
        occupancyService.resolveConflict(conflict.getId(), true, "New Arjun Family", "OWNER");
        
        Household active = householdRepository.findByFlatIdAndStatus("flat-bhooja-a101", "ACTIVE").orElseThrow();
        assertEquals("New Arjun Family", active.getFamilyName());
    }

    @Test
    @DisplayName("7 & 8. Groupable Service Demand Aggregation & Quotation")
    void testDemandAggregationAndQuotation() {
        // Create valid new household
        Household newHouse = new Household();
        newHouse.setId("house-test-99");
        newHouse.setFlatId("flat-bhooja-a102");
        newHouse.setFamilyName("Test Join Family");
        newHouse.setResidentType("OWNER");
        newHouse.setStatus("ACTIVE");
        newHouse.setMoveInDate(LocalDate.now());
        householdRepository.save(newHouse);

        var membership = poolService.joinPool("pool-bhooja-ac-1", "house-test-99", "user-resident-ananya", 2, "Need AC wash");
        assertNotNull(membership.getId());

        var quotation = poolService.submitQuotation("pool-bhooja-ac-1", "prov-coolcare", new BigDecimal("750.00"), new BigDecimal("5250.00"), LocalDate.now().plusDays(7), "Includes gas refill discount");
        assertNotNull(quotation.getId());
        assertEquals("PENDING", quotation.getStatus());
    }

    @Test
    @DisplayName("9 & 10. Booking & Verified Review Authorization")
    void testBookingAndReviewAuthorization() {
        ServiceBooking booking = bookingService.createBooking("comm-bhooja", "house-bhooja-a101", "srv-ac-service", "prov-coolcare", null, "GROUP", LocalDateTime.now().plusDays(1), new BigDecimal("1500.00"), "Morning slot");
        assertEquals("CONFIRMED", booking.getStatus());

        assertThrows(Exception.class, () -> {
            bookingService.submitReview(booking.getId(), "user-resident-rahul", 5, "Great service!");
        });

        bookingService.updateStatus(booking.getId(), "COMPLETED");

        ProviderReview review = bookingService.submitReview(booking.getId(), "user-resident-rahul", 5, "Great service!");
        assertNotNull(review.getId());
        assertEquals(5, review.getRating());
    }
}
