package com.backend.domain.auth.repository

import com.backend.domain.auth.entity.RefreshToken
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RefreshTokenRepository : JpaRepository<RefreshToken, Long> {

    fun findByMemberPk(memberPk: Long): RefreshToken?

    fun findByToken(token: String): RefreshToken?

    fun deleteByMemberPk(memberPk: Long)

    fun existsByMemberPk(memberPk: Long): Boolean
}

