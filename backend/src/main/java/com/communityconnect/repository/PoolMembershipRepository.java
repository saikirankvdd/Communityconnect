package com.communityconnect.repository;

import com.communityconnect.model.PoolMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PoolMembershipRepository extends JpaRepository<PoolMembership, String> {
    List<PoolMembership> findByPoolId(String poolId);
    Optional<PoolMembership> findByPoolIdAndHouseholdId(String poolId, String householdId);
    List<PoolMembership> findByHouseholdId(String householdId);
}
