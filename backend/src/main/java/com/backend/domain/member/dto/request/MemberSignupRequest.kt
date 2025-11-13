package com.backend.domain.member.dto.request;

import com.backend.domain.member.entity.Member;
import com.backend.domain.member.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MemberSignupRequest(

        @NotBlank(message = "아이디는 필수 입력값입니다.")
        @Size(min = 4, max = 20, message = "아이디는 4~20자여야 합니다.")
        String memberId,

        @NotBlank(message = "비밀번호는 필수 입력값입니다.")
        @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
        @Pattern(
                regexp = "^[A-Za-z0-9!@#$%^&*()_+=\\-{}\\[\\]:;\"'<>,.?/]+$",
                message = "비밀번호는 영문자, 숫자, 특수문자만 포함할 수 있습니다."
        )
        String password,

        @Email(message = "이메일 형식이 올바르지 않습니다.")
        String email,

        @NotBlank
        String nickname
) {
    public Member toEntity(String encodedPassword) {
        return Member.builder()
                .memberId(memberId)
                .password(encodedPassword)
                .email(email)
                .nickname(nickname)
                .role(Role.USER)
                .build();
    }
}
