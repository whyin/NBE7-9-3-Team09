package com.backend.domain.plan.service;

import com.backend.domain.member.entity.Member;
import com.backend.domain.member.repository.MemberRepository;
import com.backend.domain.plan.dto.PlanMemberAddRequestBody;
import com.backend.domain.plan.dto.PlanMemberAnswerRequestBody;
import com.backend.domain.plan.dto.PlanMemberMyResponseBody;
import com.backend.domain.plan.dto.PlanMemberResponseBody;
import com.backend.domain.plan.entity.Plan;
import com.backend.domain.plan.repository.PlanMemberRepository;
import com.backend.domain.plan.repository.PlanRepository;
import com.backend.global.exception.BusinessException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("dev")
@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class PlanMemberServiceTest {
    private static final Logger log = LoggerFactory.getLogger(PlanServiceTest.class);
    @Autowired
    PlanMemberService planMemberService;

    @Autowired
    PlanMemberRepository planMemberRepository;

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    PlanRepository planRepository;

    @Test
    @DisplayName("일정 초대 성공")
    void invitePlanMember_success() {
        // given: member1(1L)이 자신의 plan1(1L)에 member2(2L)를 초대
        PlanMemberAddRequestBody request = new PlanMemberAddRequestBody(3L, 1L);

        // when
        PlanMemberResponseBody result = planMemberService.invitePlanMember(request, 1L);

        // then
        Plan plan = planRepository.findById(1L).get();
        Member member = memberRepository.findById(3L).get();

        Assertions.assertNotNull(result);
        Assertions.assertEquals(member.getMemberId(), result.getMemberLoginId());
        Assertions.assertEquals(plan.getTitle(), result.getPlanTitle());
    }

    @Test
    @DisplayName("일정 초대 실패 - 다른 사람의 일정")
    void invitePlanMember_notMyPlan_fail() {
        // member2(2L)가 member1(1L)의 plan1(1L)를 초대하려 시도 → 실패
        PlanMemberAddRequestBody request = new PlanMemberAddRequestBody(1L, 3L);

        Assertions.assertThrows(BusinessException.class, () ->
                planMemberService.invitePlanMember(request, 2L)
        );
    }

    @Test
    @DisplayName("내가 초대된 목록 조회")
    void myInvitedPlanList_success() {
        // given: 초기데이터에서 member1은 plan1, plan3에 있음

        // when
        List<PlanMemberMyResponseBody> list = planMemberService.myInvitedPlanList(1L);

        // then
        Assertions.assertFalse(list.isEmpty());
        Assertions.assertTrue(list.size() >= 2);
    }

    @Test
    @DisplayName("초대 삭제 성공")
    void deletePlanMember_success() {
        //given: planMember1 → member1이 plan1에 존재
        PlanMemberAddRequestBody request = new PlanMemberAddRequestBody(2L, 1L);

        //when
        PlanMemberResponseBody result = planMemberService.DeletePlanMember(request, 1L);

        // then
        Assertions.assertFalse(planMemberRepository.existsByPlanIdAndMemberId(2L, 1L));
    }

    @Test
    @DisplayName("초대 수락 성공")
    void acceptInvitePlanMember_success() {
        // given: 초기데이터에서 member1 → plan3의 planMemberId 3L
        PlanMemberAnswerRequestBody request = new PlanMemberAnswerRequestBody(3L, 3L, 1L);

        //when
        PlanMemberResponseBody result = planMemberService.acceptInvitePlanMember(request, 3L);

        //then
        Assertions.assertTrue(result.isConfirmed());
    }

    @Test
    @DisplayName("초대 거절 성공")
    void denyInvitePlanMember_success() {
        // given
        PlanMemberAnswerRequestBody request = new PlanMemberAnswerRequestBody(3L, 3L, 1L);

        // when
        PlanMemberResponseBody result = planMemberService.denyInvitePlanMember(request, 3L);

        // then
        Assertions.assertFalse(result.isConfirmed());
    }

    @Test
    @DisplayName("초대 상태 확인 - 플랜 멤버인지 여부")
    void isAvailablePlanMember_success() {
        // given: member1 → plan1 은 존재
        Member member = memberRepository.getReferenceById(1L);

        // when
        boolean exists = planMemberService.isAvailablePlanMember(1L, member.getId());

        // then
        Assertions.assertTrue(exists);
    }

    @Test
    @DisplayName("초대 상태 확인 - 존재하지 않음")
    void isAvailablePlanMember_fail() {
        Member member3 = memberRepository.getReferenceById(3L);

        boolean exists = planMemberService.isAvailablePlanMember(1L, member3.getId());

        Assertions.assertFalse(exists);
    }

    @Test
    @DisplayName("어떤 계획에 초대된 사용자 목록")
    void isMyPlanMember_success() {
        List<PlanMemberResponseBody> results = planMemberService.getPlanMembers(1L,1L);
        Assertions.assertFalse(results.isEmpty());
        Assertions.assertTrue(results.size() == 2);
    }
}
