package com.backend.domain.member.repository

import com.backend.domain.member.entity.Member
import com.backend.domain.member.entity.Provider
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface MemberRepository : JpaRepository<Member, Long>, MemberRepositoryCustom {
    fun findByMemberId(memberId: String): Member?

    fun existsByMemberId(memberId: String): Boolean
    fun existsByEmail(email: String): Boolean

    @Query("select m from Member m where m.email = :email")
    fun findByEmail(email: String): Member?

    // provider + providerId 로 회원 조회
    fun findByProviderAndProviderId(provider: Provider, providerId: String): Member?
    fun existsByProviderAndProviderId(provider: Provider, providerId: String): Boolean
}