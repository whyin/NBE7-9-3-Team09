package com.backend.domain.member.dto.response;

import com.backend.domain.member.entity.Member;
import com.backend.domain.member.entity.Role;

public record MemberResponse(
        Long id,
        String memberId,
        String email,
        String nickname,
        Role role
) {
    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getId(),
                member.getMemberId(),
                member.getEmail(),
                member.getNickname(),
                member.getRole()
        );
    }
}
