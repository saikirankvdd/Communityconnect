package com.communityconnect.service;

import com.communityconnect.model.OccupancyConflict;
import com.communityconnect.repository.OccupancyConflictRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class OccupancyConflictService {

    private final OccupancyConflictRepository conflictRepository;

    public OccupancyConflictService(OccupancyConflictRepository conflictRepository) {
        this.conflictRepository = conflictRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public OccupancyConflict createAndSaveConflict(String flatId, String previousHouseholdId, String requestingUserId) {
        OccupancyConflict conflict = new OccupancyConflict();
        conflict.setId("conflict-" + UUID.randomUUID().toString().substring(0, 8));
        conflict.setFlatId(flatId);
        conflict.setPreviousHouseholdId(previousHouseholdId);
        conflict.setRequestingUserId(requestingUserId);
        conflict.setStatus("PENDING_VERIFICATION");
        return conflictRepository.save(conflict);
    }
}
