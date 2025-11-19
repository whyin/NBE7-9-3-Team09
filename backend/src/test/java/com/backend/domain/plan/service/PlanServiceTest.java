package com.backend.domain.plan.service;

import com.backend.domain.member.repository.MemberRepository;
import com.backend.domain.plan.dto.PlanCreateRequestBody;
import com.backend.domain.plan.dto.PlanResponseBody;
import com.backend.domain.plan.dto.PlanUpdateRequestBody;
import com.backend.domain.plan.entity.Plan;
import com.backend.domain.plan.repository.PlanRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("dev")
@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class PlanServiceTest {
    private static final Logger log = LoggerFactory.getLogger(PlanServiceTest.class);
    @Autowired
    private PlanService planService;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Test
    @DisplayName("1. 1번 계획의 존재 여부 테스트")
    void t1(){
        Plan plan = planService.getPlanById(1L);

        assertThat(plan).isNotNull();
    }

    @Test
    @DisplayName("2. 계획 목록 조회")
    void t2(){
        List<PlanResponseBody> planList = planService.getPlanList(1L);

        assertThat(planList).isNotNull();
        assertThat(planList).size().isEqualTo(2);
        assertThat(planList.get(0).title).isEqualTo("초기 일정 데이터1");
    }

    @Test
    @DisplayName("3. 계획 작성 테스트")
    void t3(){
        PlanCreateRequestBody planCreateRequestBody = new PlanCreateRequestBody(
                "test1",
                "테스트",
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(2)
        );

        planService.createPlan(planCreateRequestBody,1L);
        Plan resultPlan = planRepository.getPlanByTitle("test1");

        assertThat(resultPlan).isNotNull();
        assertThat(resultPlan.getTitle()).isEqualTo("test1");
        assertThat(resultPlan.getContent()).isEqualTo("테스트");
    }

    @Test
    @DisplayName("4. 계획 수정 테스트")
    void t4(){
        PlanUpdateRequestBody planUpdateRequestBody = new PlanUpdateRequestBody(
                2L,
                "수정된 제목",
                "테스트2",
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(2)
        );

        planService.updatePlan(2L,planUpdateRequestBody,2L);
        Plan resultPlan = planRepository.getPlanByTitle("수정된 제목");

        assertThat(resultPlan).isNotNull();
        assertThat(resultPlan.getTitle()).isEqualTo("수정된 제목");
        assertThat(resultPlan.getContent()).isEqualTo("테스트2");
    }

    @Test
    @DisplayName("5. 계획 삭제 테스트")
    void t5(){
        List<PlanResponseBody> planList1 = planService.getPlanList(1L);
        planService.deletePlanById(3L,1L);

        List<PlanResponseBody> planList2 = planService.getPlanList(1L);
        assertThat(planList2).isNotNull();
        assertThat(planList2).size().isEqualTo(planList1.size() -1);
    }

    @Test
    @DisplayName("6. 오늘 계획 조회")
    void t6(){
        PlanResponseBody planResponseBody = planService.getTodayPlan(1L);
        Plan plan = planRepository.getPlanByStartDateBeforeAndEndDateAfter(LocalDateTime.now().toLocalDate().atStartOfDay().plusSeconds(1),LocalDateTime.now().toLocalDate().atTime(LocalTime.MAX).minusSeconds(1));

        PlanResponseBody toBePlanResponseBody =  new PlanResponseBody(plan);

        assertThat(planResponseBody.title).isEqualTo(toBePlanResponseBody.title);

    }

    @Test
    @DisplayName("7. 내가 초대된 목록 조회")
    void t7(){
        List<PlanResponseBody> result= planService.getInvitedAcceptedPlan(1L);
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(1);
    }

}