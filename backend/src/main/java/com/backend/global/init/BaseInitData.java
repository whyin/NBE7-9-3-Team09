package com.backend.global.init;

import com.backend.domain.member.entity.Member;
import com.backend.domain.member.entity.Role;
import com.backend.domain.member.repository.MemberRepository;
import com.backend.domain.plan.entity.Plan;
import com.backend.domain.plan.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class BaseInitData {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final PlanRepository planRepository;

    @Bean
    public ApplicationRunner InitData() {
        return args -> {
            if (memberRepository.count() == 0) {

                Member member1 = Member.builder()
                        .memberId("member1")
                        .password(passwordEncoder.encode("1111"))
                        .email("member1@gmail.com")
                        .nickname("사용자1")
                        .role(Role.USER)
                        .build();

                Member member2 = Member.builder()
                        .memberId("member2")
                        .password(passwordEncoder.encode("2222"))
                        .email("member2@gmail.com")
                        .nickname("사용자2")
                        .role(Role.ADMIN)
                        .build();

                Member admin = Member.builder()
                        .memberId("admin")
                        .password(passwordEncoder.encode("admin1234"))
                        .email("admin@gmail.com")
                        .nickname("관리자")
                        .role(Role.ADMIN)
                        .build();

                memberRepository.saveAll(List.of(member1, member2, admin));
                log.info("초기 member 데이터 세팅 완료: ");
            }


            if(planRepository.count() == 0) {

                Plan plan1 = new Plan(
                        null,
                        memberRepository.getMemberById(1L).get(0),
                        LocalDateTime.now(),
                        LocalDateTime.now(),
                        LocalDateTime.now().plusDays(2L),
                        LocalDateTime.now().plusDays(4L),
                        "초기 일정 데이터1",
                        "초기 일정 데이터 내용1"
                );

                Plan plan2 = new Plan(
                        null,
                        memberRepository.getMemberById(2L).get(0),
                        LocalDateTime.now(),
                        LocalDateTime.now(),
                        LocalDateTime.now().plusDays(2L),
                        LocalDateTime.now().plusDays(4L),
                        "초기 일정 데이터2",
                        "초기 일정 데이터 내용2"
                );

                Plan plan3 = new Plan(
                        null,
                        memberRepository.getMemberById(1L).get(0),
                        LocalDateTime.now(),
                        LocalDateTime.now(),
                        LocalDateTime.now().plusDays(3L),
                        LocalDateTime.now().plusDays(4L),
                        "초기 일정 데이터3",
                        "초기 일정 데이터 내용3"
                );

                Plan plan4 = new Plan(
                        null,
                        memberRepository.getMemberById(1L).get(0),
                        LocalDateTime.now(),
                        LocalDateTime.now(),
                        LocalDateTime.now().plusDays(4L),
                        LocalDateTime.now().plusDays(5L),
                        "초기 일정 데이터4",
                        "초기 일정 데이터 내용4"
                );

                planRepository.saveAll(List.of(plan1, plan2, plan3));
                log.info("초기 plan 데이터 세팅 완료: ");
            }
        };


    }


}
