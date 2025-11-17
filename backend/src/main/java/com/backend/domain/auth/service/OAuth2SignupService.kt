package com.backend.domain.auth.service

import com.backend.domain.auth.dto.reponse.TokenResponse
import com.backend.domain.auth.dto.request.OAuth2SignupRequest
import com.backend.domain.auth.entity.RefreshToken
import com.backend.domain.auth.repository.RefreshTokenRepository
import com.backend.domain.member.entity.Member
import com.backend.domain.member.repository.MemberRepository
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import com.backend.global.security.jwt.JwtTokenProvider
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class OAuth2SignupService(
    private val memberRepository: MemberRepository,
    private val jwtTokenProvider: JwtTokenProvider,
) {

    @Transactional
    fun signupWithOAuth2(request: OAuth2SignupRequest): Member {

        // 1) TempToken Claims 파싱
        val claims = runCatching {
            jwtTokenProvider.parseOAuth2TempToken(request.tempToken)
        }.getOrElse {
            throw BusinessException(ErrorCode.INVALID_TOKEN)
        }

        // 2) providerId 중복 검사
        if (memberRepository.existsByProviderAndProviderId(claims.provider, claims.providerId)) {
            throw BusinessException(ErrorCode.DUPLICATE_MEMBER_ID)
        }

        // 3) 소셜 이메일 중복 검사
        if (memberRepository.existsByEmail(claims.email)) {
            throw BusinessException(ErrorCode.DUPLICATE_EMAIL)
        }

        // 4) 소셜 회원 생성
        val member = Member.createKakao(
            providerId = claims.providerId,
            email = claims.email,
            nickname = request.nickname
        )

        return memberRepository.save(member)
    }
}