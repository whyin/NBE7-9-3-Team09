package com.backend.domain.auth.service

import com.backend.domain.auth.dto.reponse.TokenResponse
import com.backend.domain.auth.dto.request.OAuth2SignupRequest
import com.backend.domain.member.entity.Member
import com.backend.domain.member.repository.MemberRepository
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import com.backend.global.security.jwt.JwtTokenProvider
import org.springframework.stereotype.Service

@Service
class OAuth2SignupService(
    private val memberRepository: MemberRepository,
    private val jwtTokenProvider: JwtTokenProvider,
) {

    fun signupWithOAuth2(request: OAuth2SignupRequest): TokenResponse {

        // 1) TempToken Claims 파싱
        val claims = runCatching {
            jwtTokenProvider.parseOAuth2TempToken(request.tempToken)
        }.getOrElse {
            throw BusinessException(ErrorCode.INVALID_TOKEN)
        }

        // 2) providerId로 중복 검사 TODO: 에러코드 적합하게 수정하기
        if (memberRepository.existsByProviderAndProviderId(claims.provider, claims.providerId)) {
            throw BusinessException(ErrorCode.DUPLICATE_MEMBER_ID)
        }

        // 3) 소셜 이메일 중복 검사
        if (memberRepository.existsByEmail(claims.email)) {
            throw BusinessException(ErrorCode.DUPLICATE_EMAIL)
        }

        // 소셜 회원 생성
        val member = Member.createKakao(
            providerId = claims.providerId,
            email = claims.email,
            nickname = request.nickname
        )

        memberRepository.save(member)

        // 5) JWT 발급
        val accessToken = jwtTokenProvider.generateAccessToken(member.id!!, member.role)
        val refreshToken = jwtTokenProvider.generateRefreshToken(member.id!!, member.role)

        // 6) TokenResponse 반환
        return TokenResponse(
            accessToken = accessToken,
            refreshToken = refreshToken,
            refreshTokenMaxAge = jwtTokenProvider.refreshTokenExpireTime,
            role = member.role.name
        )
    }
}