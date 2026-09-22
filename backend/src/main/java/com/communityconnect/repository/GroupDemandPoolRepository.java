package com.communityconnect.repository;

import com.communityconnect.model.GroupDemandPool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupDemandPoolRepository extends JpaRepository<GroupDemandPool, String> {
    List<GroupDemandPool> findByCommunityId(String communityId);
    List<GroupDemandPool> findByCommunityIdAndStatus(String communityId, String status);
}
