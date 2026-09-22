package com.communityconnect.repository;

import com.communityconnect.model.ProviderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, String> {
    Optional<ProviderProfile> findByUserId(String userId);
}
