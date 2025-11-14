package com.backend.domain.auth.repository;

import com.backend.domain.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByMemberPk(Long memberId);

    Optional<RefreshToken> findByToken(String token);

    void deleteByMemberPk(Long memberId);

    boolean existsByMemberPk(Long memberId);
}
