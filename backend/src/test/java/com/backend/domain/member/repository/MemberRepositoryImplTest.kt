package com.backend.domain.member.repository

import com.backend.domain.member.entity.Member
import com.backend.global.config.QuerydslConfig
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.context.annotation.Import
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest

@DataJpaTest
@Import(QuerydslConfig::class, MemberRepositoryImpl::class)
class MemberRepositoryImplTest {

    @Autowired
    lateinit var memberRepository: MemberRepository

    @PersistenceContext
    lateinit var em: EntityManager

    @BeforeEach
    fun setup() {
        // 1~15번 회원 저장
        val members = (1..15).map {
            Member.createLocal(
                memberId = "user$it",
                password = "pw$it",
                email = "user$it@test.com",
                nickname = "nick$it"
            )
        }

        memberRepository.saveAll(members)
        em.flush()
        em.clear()
    }

    @Test
    fun `첫 번째 페이지는 user1부터 user7까지 반환된다`() {
        val pageable = PageRequest.of(0, 7)
        val result: Page<Member> = memberRepository.searchMembers(pageable)

        assertEquals(7, result.content.size)
        assertEquals("user1", result.content.first().memberId)
        assertEquals("user7", result.content.last().memberId)
    }

    @Test
    fun `두 번째 페이지는 user8부터 user14까지 반환된다`() {
        val pageable = PageRequest.of(1, 7)
        val result: Page<Member> = memberRepository.searchMembers(pageable)

        assertEquals(7, result.content.size)
        assertEquals("user8", result.content.first().memberId)
        assertEquals("user14", result.content.last().memberId)
    }

    @Test
    fun `마지막 페이지는 user15 한 명만 반환된다`() {
        val pageable = PageRequest.of(2, 7)
        val result: Page<Member> = memberRepository.searchMembers(pageable)

        assertEquals(1, result.content.size)
        assertEquals("user15", result.content.first().memberId)
    }
}
