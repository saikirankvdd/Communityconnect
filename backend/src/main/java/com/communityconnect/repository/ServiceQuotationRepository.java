package com.communityconnect.repository;

import com.communityconnect.model.ServiceQuotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceQuotationRepository extends JpaRepository<ServiceQuotation, String> {
    List<ServiceQuotation> findByPoolId(String poolId);
    List<ServiceQuotation> findByProviderId(String providerId);
}
