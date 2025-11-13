package com.backend.global.init;

import com.backend.domain.member.entity.Member;
import com.backend.domain.member.entity.Role;
import com.backend.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class BaseInitData {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

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
        };
    }


}
