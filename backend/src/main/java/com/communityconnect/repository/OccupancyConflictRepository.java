package com.communityconnect.repository;

import com.communityconnect.model.OccupancyConflict;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OccupancyConflictRepository extends JpaRepository<OccupancyConflict, String> {
    List<OccupancyConflict> findByFlatId(String flatId);
    List<OccupancyConflict> findByStatus(String status);
    Optional<OccupancyConflict> findByFlatIdAndStatus(String flatId, String status);
}
