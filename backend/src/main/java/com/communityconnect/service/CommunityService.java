package com.communityconnect.service;

import com.communityconnect.exception.CommunityAccessDeniedException;
import com.communityconnect.exception.ResourceNotFoundException;
import com.communityconnect.model.Community;
import com.communityconnect.repository.CommunityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;

    public CommunityService(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Community getCommunityById(String communityId) {
        return communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found with ID: " + communityId));
    }

    @Transactional
    public Community updateSubscriptionStatus(String communityId, String newStatus) {
        Community community = getCommunityById(communityId);
        community.setSubscriptionStatus(newStatus);
        community.setStatus(newStatus);
        return communityRepository.save(community);
    }

    public void validateCommunityAccess(Community community) {
        if (!"ACTIVE".equalsIgnoreCase(community.getSubscriptionStatus())) {
            throw new CommunityAccessDeniedException("Community operations are restricted because subscription status is " + community.getSubscriptionStatus());
        }
    }
}
