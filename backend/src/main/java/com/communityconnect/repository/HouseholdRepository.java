package com.communityconnect.repository;

import com.communityconnect.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdRepository extends JpaRepository<Household, String> {
    Optional<Household> findByFlatIdAndStatus(String flatId, String status);
    List<Household> findByFlatId(String flatId);
    Optional<Household> findByPrimaryResidentIdAndStatus(String primaryResidentId, String status);
}
