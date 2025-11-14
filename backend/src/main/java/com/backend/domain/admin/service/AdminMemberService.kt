package com.backend.domain.admin.service

import com.backend.domain.admin.dto.response.MemberAdminResponse
import com.backend.domain.admin.dto.response.MemberAdminResponse.Companion.from
import com.backend.domain.auth.repository.RefreshTokenRepository
import com.backend.domain.member.entity.Member
import com.backend.domain.member.entity.Role
import com.backend.domain.member.repository.MemberRepository
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class AdminMemberService(
    private val memberRepository: MemberRepository,
    private val refreshTokenRepository: RefreshTokenRepository
) {
    fun getAllMembers(): List<MemberAdminResponse> =
        memberRepository.findAll().map(::from)


    fun getMemberById(id: Long): MemberAdminResponse =
        from(getMember(id))

    @Transactional
    fun deleteMember(id: Long) {
        val member = getMember(id)

        // 관리자 삭제 방지
        if (member.role == Role.ADMIN)
            throw BusinessException(ErrorCode.ACCESS_DENIED)


        val memberPk = member.id
            ?: throw BusinessException(ErrorCode.INVALID_MEMBER)

        // 관련 RefreshToken 삭제
        invalidateRefreshToken(memberPk)
        memberRepository.deleteById(id)
    }

    @Transactional
    fun invalidateRefreshToken(id: Long) {
        refreshTokenRepository.deleteByMemberPk(id)
    }

    /** 공통 메서드  */
    private fun getMember(id: Long): Member {
        return memberRepository.findByIdOrNull(id)
            ?: throw BusinessException(ErrorCode.MEMBER_NOT_FOUND)
    }
}
