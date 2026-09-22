package com.communityconnect.repository;

import com.communityconnect.model.TemporaryPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemporaryPassRepository extends JpaRepository<TemporaryPass, String> {
    List<TemporaryPass> findByHouseholdId(String householdId);
    List<TemporaryPass> findByHouseholdIdAndStatus(String householdId, String status);
}
