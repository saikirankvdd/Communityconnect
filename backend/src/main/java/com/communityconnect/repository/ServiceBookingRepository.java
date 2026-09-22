package com.communityconnect.repository;

import com.communityconnect.model.ServiceBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceBookingRepository extends JpaRepository<ServiceBooking, String> {
    List<ServiceBooking> findByCommunityId(String communityId);
    List<ServiceBooking> findByHouseholdId(String householdId);
    List<ServiceBooking> findByProviderId(String providerId);
}
