package com.communityconnect.repository;

import com.communityconnect.model.ServiceCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, String> {
    List<ServiceCatalog> findByGroupable(boolean groupable);
    List<ServiceCatalog> findByCategory(String category);
}
