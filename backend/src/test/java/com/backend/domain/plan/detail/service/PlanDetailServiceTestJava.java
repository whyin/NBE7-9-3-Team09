package com.backend.domain.plan.detail.service;

import com.backend.domain.member.repository.MemberRepository;
import com.backend.domain.plan.detail.dto.PlanDetailRequestBody;
import com.backend.domain.plan.detail.dto.PlanDetailResponseBody;
import com.backend.domain.plan.detail.dto.PlanDetailsElementBody;
import com.backend.domain.plan.detail.entity.PlanDetail;
import com.backend.domain.plan.detail.repository.PlanDetailRepository;
import com.backend.domain.plan.entity.Plan;
import com.backend.domain.plan.repository.PlanRepository;
import com.backend.global.exception.BusinessException;
import com.backend.global.response.ErrorCode;
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
import static org.assertj.core.api.Assertions.assertThatThrownBy;

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
    @DisplayName("1. 계획 상세 조회")
    void t1(){
        var planDetails = planDetailService.getPlanDetailsByPlanId(1L,1L);

        assertThat(planDetails.size()).isEqualTo(1);
    }

    @Test
    @DisplayName("2. 계획 상세 추가")
    void t2(){
        String title = "계획 상세 추가 테스트1";
        String  content = "계획 상세 추가 테스트 내용입니다.";
        PlanDetailRequestBody planDetailRequestBody = new PlanDetailRequestBody(
                1L,
                1L,
                LocalDateTime.now().plusHours(3L),
                LocalDateTime.now().plusHours(3L).plusMinutes(30L),
                title,
                content
        );

        planDetailService.addPlanDetail(planDetailRequestBody,1L);
        var planDetails  =planDetailRepository.getPlanDetailsByPlanId(1L);

        assertThat(planDetails.size()).isEqualTo(2);
        assertThat(planDetails.get(planDetails.size()-1).getTitle()).isEqualTo(title);
        assertThat(planDetails.get(planDetails.size()-1).getContent()).isEqualTo(content);
    }

    @Test
    @DisplayName("3. 계획 상세 추가, 겹치는 시간")
    void t3(){
        String title = "계획 상세 추가 테스트1";
        String  content = "계획 상세 추가 테스트 내용입니다.";
        PlanDetailsElementBody planDetailsElementBody = planDetailService.getPlanDetailById(1L,1L);

        PlanDetailRequestBody planDetailRequestBody = new PlanDetailRequestBody(
                1L,
                1L,
                LocalDateTime.now().plusHours(3L),
                LocalDateTime.now().plusHours(3L).plusMinutes(30L),
                title,
                content
        );

        planDetailService.addPlanDetail(planDetailRequestBody,1L);
        assertThatThrownBy(
                () -> planDetailService.addPlanDetail(planDetailRequestBody,1L)
        ).isInstanceOf(BusinessException.class)
                .hasMessageContaining(ErrorCode.CONFLICT_TIME.getMessage());

    }


    @Test
    @DisplayName("4. 계획 상세 수정")
    void updatePlanDetail_success() {
        // given
        Long planDetailId = 1L;
        Long memberPkId = 1L;

        PlanDetail before = planDetailRepository.findById(planDetailId)
                .orElseThrow(() -> new RuntimeException("PlanDetail not found"));

        PlanDetailRequestBody request = new PlanDetailRequestBody(
                1L, // planId
                1L, // placeId
                LocalDateTime.now().plusHours(3),
                LocalDateTime.now().plusHours(4),
                "수정된 제목",
                "수정된 내용"
        );

        // when
        PlanDetailResponseBody response = planDetailService.updatePlanDetail(
                request,
                memberPkId,
                planDetailId
        );

        // then
        PlanDetail updated = planDetailRepository.findById(planDetailId)
                .orElseThrow();

        assertThat(updated.getTitle()).isEqualTo("수정된 제목");
        assertThat(updated.getContent()).isEqualTo("수정된 내용");
        assertThat(updated.getStartTime()).isEqualTo(request.startTime());
        assertThat(updated.getEndTime()).isEqualTo(request.endTime());
        assertThat(updated.getPlace().getId()).isEqualTo(request.placeId());

        // ResponseBody도 검증
        assertThat(response.title()).isEqualTo("수정된 제목");
        assertThat(response.content()).isEqualTo("수정된 내용");
    }

    @Test
    @DisplayName("5. 계획상세 삭제")
    void deletePlanDetail_success() {
        // given
        Long planDetailId = 1L;  // 초기 DB에 저장된 PK
        Long memberPkId = 1L;    // 올바른 멤버

        boolean existsBefore = planDetailRepository.existsById(planDetailId);
        assertThat(existsBefore).isTrue();  // 삭제 전 존재해야 함

        // when
        planDetailService.deletePlanDetail(planDetailId, memberPkId);

        // then
        boolean existsAfter = planDetailRepository.existsById(planDetailId);
        assertThat(existsAfter).isFalse(); // 삭제되어야 함
    }

    @Test
    @DisplayName("6. 유효하지 않은 회원")
    void deletePlanDetail_invalidMember_throwsException() {
        Long planDetailId = 1L;
        Long wrongMemberId = 999L;

        assertThatThrownBy(() ->
                planDetailService.deletePlanDetail(planDetailId, wrongMemberId)
        ).isInstanceOf(BusinessException.class)
                .hasMessageContaining(ErrorCode.MEMBER_NOT_FOUND.getMessage());
    }
}
