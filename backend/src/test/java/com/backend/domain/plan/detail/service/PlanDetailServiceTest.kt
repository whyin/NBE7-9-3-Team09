package com.backend.domain.plan.detail.service

import com.backend.domain.member.repository.MemberRepository
import com.backend.domain.plan.detail.dto.PlanDetailRequestBody
import com.backend.domain.plan.detail.repository.PlanDetailRepository
import com.backend.domain.plan.repository.PlanRepository
import com.backend.domain.plan.service.PlanService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime


@ActiveProfiles("dev")
@SpringBootTest
@Transactional
@AutoConfigureMockMvc
class PlanDetailServiceTest{
    @Autowired
    lateinit var planDetailService: PlanDetailService;
    @Autowired
    lateinit var planDetailRepository: PlanDetailRepository
    @Autowired
    lateinit var planRepository: PlanRepository
    @Autowired
    lateinit var memberRepository: MemberRepository

    @Test
    @DisplayName("1. 1번 계획의 계획 상세 조회")
    fun t1(){
        val title :String = "계획 상세 추가 테스트1"
        val content : String = "계획 상세 추가 테스트 내용입니다."
        val planDetailRequestBody = PlanDetailRequestBody(
            1L,
            1L,
            LocalDateTime.now().plusHours(1L),
            LocalDateTime.now().plusHours(1L).plusMinutes(30L),
            "계획 상세 추가 테스트 1",
            "계획 상세 추가 테스트 내용입니다."
        )

        planDetailService.addPlanDetail(planDetailRequestBody,1L)
        val planDetails = planDetailService.getPlanDetailsByPlanId(1L,1L);

        assertThat(planDetails.size).isEqualTo(1)
        assertThat(planDetails.get(0).title).isEqualTo(title)
        assertThat(planDetails.get(0).content).isEqualTo(content)
    }
}