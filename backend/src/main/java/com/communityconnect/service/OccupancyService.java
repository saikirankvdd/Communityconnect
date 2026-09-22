package com.communityconnect.service;

import com.communityconnect.exception.OccupancyConflictException;
import com.communityconnect.exception.ResourceNotFoundException;
import com.communityconnect.model.Household;
import com.communityconnect.model.OccupancyConflict;
import com.communityconnect.repository.HouseholdRepository;
import com.communityconnect.repository.OccupancyConflictRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OccupancyService {

    private final HouseholdRepository householdRepository;
    private final OccupancyConflictRepository conflictRepository;
    private final OccupancyConflictService conflictService;

    public OccupancyService(
            HouseholdRepository householdRepository,
            OccupancyConflictRepository conflictRepository,
            OccupancyConflictService conflictService) {
        this.householdRepository = householdRepository;
        this.conflictRepository = conflictRepository;
        this.conflictService = conflictService;
    }

    @Transactional
    public Household registerOccupancy(String flatId, String residentUserId, String familyName, String residentType) {
        Optional<Household> activeHousehold = householdRepository.findByFlatIdAndStatus(flatId, "ACTIVE");

        if (activeHousehold.isPresent()) {
            Household existing = activeHousehold.get();
            // Delegate to proxy bean for REQUIRES_NEW transaction
            conflictService.createAndSaveConflict(flatId, existing.getId(), residentUserId);
            throw new OccupancyConflictException("An active household already exists for flat " + flatId + ". Occupancy verification ticket created.");
        }

        Household household = new Household();
        household.setId("house-" + UUID.randomUUID().toString().substring(0, 8));
        household.setFlatId(flatId);
        household.setPrimaryResidentId(residentUserId);
        household.setFamilyName(familyName);
        household.setResidentType(residentType);
        household.setStatus("ACTIVE");
        household.setMoveInDate(LocalDate.now());

        return householdRepository.save(household);
    }

    @Transactional
    public OccupancyConflict submitSecurityReport(String conflictId, String securityUserId, String reportContent) {
        OccupancyConflict conflict = conflictRepository.findById(conflictId)
                .orElseThrow(() -> new ResourceNotFoundException("Occupancy conflict ticket not found"));

        conflict.setAssignedSecurityId(securityUserId);
        conflict.setSecurityReport(reportContent);
        conflict.setStatus("REPORT_SUBMITTED");
        return conflictRepository.save(conflict);
    }

    @Transactional
    public OccupancyConflict resolveConflict(String conflictId, boolean approve, String familyName, String residentType) {
        OccupancyConflict conflict = conflictRepository.findById(conflictId)
                .orElseThrow(() -> new ResourceNotFoundException("Occupancy conflict ticket not found"));

        if (approve) {
            if (conflict.getPreviousHouseholdId() != null) {
                householdRepository.findById(conflict.getPreviousHouseholdId()).ifPresent(old -> {
                    old.setStatus("INACTIVE");
                    old.setMoveOutDate(LocalDate.now());
                    householdRepository.save(old);
                });
            }

            Household newHousehold = new Household();
            newHousehold.setId("house-" + UUID.randomUUID().toString().substring(0, 8));
            newHousehold.setFlatId(conflict.getFlatId());
            newHousehold.setPrimaryResidentId(conflict.getRequestingUserId());
            newHousehold.setFamilyName(familyName != null ? familyName : "New Household");
            newHousehold.setResidentType(residentType != null ? residentType : "RESIDENT");
            newHousehold.setStatus("ACTIVE");
            newHousehold.setMoveInDate(LocalDate.now());
            householdRepository.save(newHousehold);

            conflict.setStatus("APPROVED");
        } else {
            conflict.setStatus("REJECTED");
        }

        conflict.setResolvedAt(LocalDateTime.now());
        return conflictRepository.save(conflict);
    }

    public List<OccupancyConflict> getPendingConflicts() {
        return conflictRepository.findByStatus("PENDING_VERIFICATION");
    }
}
