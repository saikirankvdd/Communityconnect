package com.communityconnect.repository;

import com.communityconnect.model.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityRepository extends JpaRepository<Community, String> {
    List<Community> findByStatus(String status);
    List<Community> findBySubscriptionStatus(String subscriptionStatus);
}
