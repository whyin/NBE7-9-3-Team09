package com.backend.domain.member.repository

import com.backend.domain.member.entity.Member
import com.backend.domain.member.entity.QMember
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.support.PageableExecutionUtils

class MemberRepositoryImpl(
    private val jpaQueryFactory: JPAQueryFactory
): MemberRepositoryCustom {

    private val member = QMember.member

    override fun searchMembers(pageable: Pageable): Page<Member> {
        val content = jpaQueryFactory
            .selectFrom(member)
            .orderBy(member.id.asc())
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()

        val countQuery = jpaQueryFactory
            .select(member.count())
            .from(member)

        return PageableExecutionUtils.getPage(content, pageable) {
            countQuery.fetchOne() ?: 0L     // countQuery 결과가 null일 때 0으로 처리

        }
    }
}