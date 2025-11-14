package com.backend.domain.plan.detail.service;

import com.backend.domain.member.repository.MemberRepository;
import com.backend.domain.plan.detail.dto.PlanDetailRequestBody;
import com.backend.domain.plan.detail.entity.PlanDetail;
import com.backend.domain.plan.detail.repository.PlanDetailRepository;
import com.backend.domain.plan.entity.Plan;
import com.backend.domain.plan.repository.PlanRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("dev")
@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class PlanDetailServiceTestJava {
    @Autowired
    private PlanDetailService planDetailService;

    @Autowired
    private PlanDetailRepository planDetailRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private MemberRepository memberRepository;


    @Test
    @DisplayName("1. 1번 계획 상세 조회")
    void t1(){
        var planDetails = planDetailService.getPlanDetailsByPlanId(1L,1L);

        assertThat(planDetails.size()).isEqualTo(1);
    }

    @Test
    @DisplayName("2. 2번 계획 상세 추가")
    void t2(){
        String title = "계획 상세 추가 테스트1";
        String  content = "계획 상세 추가 테스트 내용입니다.";
        PlanDetailRequestBody planDetailRequestBody = new PlanDetailRequestBody(
                1L,
                1L,
                LocalDateTime.now().plusHours(1L),
                LocalDateTime.now().plusHours(1L).plusMinutes(30L),
                title,
                content
        );

        planDetailService.addPlanDetail(planDetailRequestBody,1L);
        var planDetails  =planDetailRepository.getPlanDetailsByPlanId(1L);

        assertThat(planDetails.size()).isEqualTo(1);
    }
}
