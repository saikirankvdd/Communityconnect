package com.communityconnect.repository;

import com.communityconnect.model.ProviderReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderReviewRepository extends JpaRepository<ProviderReview, String> {
    Optional<ProviderReview> findByBookingId(String bookingId);
    List<ProviderReview> findByProviderId(String providerId);
}
