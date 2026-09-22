package com.communityconnect.repository;

import com.communityconnect.model.Flat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlatRepository extends JpaRepository<Flat, String> {
    List<Flat> findByCommunityId(String communityId);
    Optional<Flat> findByCommunityIdAndTowerAndFlatNumber(String communityId, String tower, String flatNumber);
}
