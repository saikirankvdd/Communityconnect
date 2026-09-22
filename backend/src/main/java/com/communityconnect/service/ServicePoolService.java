package com.communityconnect.service;

import com.communityconnect.exception.ResourceNotFoundException;
import com.communityconnect.exception.UnauthorizedOperationException;
import com.communityconnect.model.GroupDemandPool;
import com.communityconnect.model.PoolMembership;
import com.communityconnect.model.ServiceQuotation;
import com.communityconnect.repository.GroupDemandPoolRepository;
import com.communityconnect.repository.PoolMembershipRepository;
import com.communityconnect.repository.ServiceQuotationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ServicePoolService {

    private final GroupDemandPoolRepository poolRepository;
    private final PoolMembershipRepository membershipRepository;
    private final ServiceQuotationRepository quotationRepository;

    public ServicePoolService(
            GroupDemandPoolRepository poolRepository,
            PoolMembershipRepository membershipRepository,
            ServiceQuotationRepository quotationRepository) {
        this.poolRepository = poolRepository;
        this.membershipRepository = membershipRepository;
        this.quotationRepository = quotationRepository;
    }

    public List<GroupDemandPool> getPoolsByCommunity(String communityId) {
        return poolRepository.findByCommunityId(communityId);
    }

    @Transactional
    public PoolMembership joinPool(String poolId, String householdId, String userId, int units, String notes) {
        GroupDemandPool pool = poolRepository.findById(poolId)
                .orElseThrow(() -> new ResourceNotFoundException("Group Demand Pool not found"));

        if (!"COLLECTING".equalsIgnoreCase(pool.getStatus())) {
            throw new UnauthorizedOperationException("Pool is no longer accepting new members. Current status: " + pool.getStatus());
        }

        OptionalMembershipCheck(poolId, householdId);

        PoolMembership membership = new PoolMembership();
        membership.setId("pm-" + UUID.randomUUID().toString().substring(0, 8));
        membership.setPoolId(poolId);
        membership.setHouseholdId(householdId);
        membership.setUserId(userId);
        membership.setRequestedUnits(units);
        membership.setNotes(notes);

        // Update pool counters
        pool.setCurrentHouseholds(pool.getCurrentHouseholds() + 1);
        pool.setCurrentUnits(pool.getCurrentUnits() + units);
        poolRepository.save(pool);

        return membershipRepository.save(membership);
    }

    @Transactional
    public ServiceQuotation submitQuotation(String poolId, String providerId, BigDecimal pricePerUnit, BigDecimal totalEstimate, LocalDate validity, String terms) {
        GroupDemandPool pool = poolRepository.findById(poolId)
                .orElseThrow(() -> new ResourceNotFoundException("Group Demand Pool not found"));

        ServiceQuotation quotation = new ServiceQuotation();
        quotation.setId("quote-" + UUID.randomUUID().toString().substring(0, 8));
        quotation.setPoolId(poolId);
        quotation.setProviderId(providerId);
        quotation.setPricePerUnit(pricePerUnit);
        quotation.setTotalEstimatedAmount(totalEstimate);
        quotation.setValidityDate(validity);
        quotation.setTerms(terms);
        quotation.setStatus("PENDING");

        pool.setStatus("QUOTING");
        poolRepository.save(pool);

        return quotationRepository.save(quotation);
    }

    private void OptionalMembershipCheck(String poolId, String householdId) {
        membershipRepository.findByPoolIdAndHouseholdId(poolId, householdId).ifPresent(existing -> {
            throw new UnauthorizedOperationException("Household is already a member of this demand pool");
        });
    }
}
