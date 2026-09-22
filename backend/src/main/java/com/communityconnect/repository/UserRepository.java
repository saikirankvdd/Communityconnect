package com.communityconnect.repository;

import com.communityconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByCommunityId(String communityId);
    boolean existsByEmail(String email);
}
