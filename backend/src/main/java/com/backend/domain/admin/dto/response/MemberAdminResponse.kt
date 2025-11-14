package com.backend.domain.admin.dto.response;

import com.backend.domain.member.entity.Member;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record MemberAdminResponse(

        Long id,
        String memberId,
        String email,
        String nickname,
        String role,
        String status
        // LocalDateTime createdAt
) {
    public static MemberAdminResponse from(Member member) {
        return new MemberAdminResponse(
                member.getId(),
                member.getMemberId(),
                member.getEmail(),
                member.getNickname(),
                member.getRole().name(),
                member.getStatus().name()
                // member.getCreatedAt()
        );
    }
}
