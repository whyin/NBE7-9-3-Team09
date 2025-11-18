package com.backend.domain.admin.dto.response

import com.backend.domain.member.entity.Member


data class MemberAdminResponse(
    val id: Long,
    val memberId: String,
    val email: String,
    val nickname: String,
    val role: String,
    val status: String // LocalDateTime createdAt
) {
    companion object {

        fun from(member: Member): MemberAdminResponse {
            return MemberAdminResponse(
                id = member.id ?: 0L, // or throw if null
                memberId = member.memberId,
                email = member.email,
                nickname = member.nickname,
                role = member.role.name,
                status = member.status.name
            )
        }
    }
}
