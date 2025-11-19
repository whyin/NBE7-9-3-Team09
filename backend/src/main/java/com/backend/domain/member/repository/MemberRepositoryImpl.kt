package com.backend.domain.member.repository

import com.backend.domain.member.entity.Member
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

class MemberRepositoryImpl(
    private val jpaQueryFactory: JPAQueryFactory
): MemberRepositoryCustom {

    override fun searchMembers(pageable: Pageable): Page<Member> {
        TODO("Not yet implemented")
    }
}