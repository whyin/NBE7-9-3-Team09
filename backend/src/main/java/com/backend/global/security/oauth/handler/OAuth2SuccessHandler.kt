package com.backend.global.security.oauth.handler

import com.backend.domain.auth.util.CookieManager
import com.backend.domain.member.entity.Provider
import com.backend.domain.member.repository.MemberRepository
import com.backend.global.security.jwt.JwtTokenProvider
import com.backend.global.security.oauth.CustomOAuth2UserService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.stereotype.Component
import org.springframework.web.util.UriComponentsBuilder

@Component
class OAuth2SuccessHandler(
    private val memberRepository: MemberRepository,
    private val jwtTokenProvider: JwtTokenProvider,
    private val cookieManager: CookieManager
) : AuthenticationSuccessHandler {

    override fun onAuthenticationSuccess(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authentication: Authentication
    ) {

        val oAuth2User = authentication.principal as org.springframework.security.oauth2.core.user.OAuth2User

        // CustomOAuth2UserService에서 넣었던 attributes
        val provider = Provider.valueOf(oAuth2User.attributes["provider"].toString())
        val providerId = oAuth2User.attributes["providerId"].toString()
        val email = oAuth2User.attributes["email"] as String? // 신규 시에는 존재

        // 기존 회원 조회
        val existingMember = memberRepository.findByProviderAndProviderId(provider, providerId)

        // 신규 회원
        if (existingMember == null) {

            // 임시 토큰 발급 (10분)
            val tempToken = jwtTokenProvider.generateOAuth2TempToken(
                provider = provider,
                providerId = providerId,
                email = email!!
            )

            val redirectUrl = UriComponentsBuilder
                .fromUriString("http://localhost:3000/oauth2/signup") // 프론트 신규가입 페이지
                .queryParam("token", tempToken)
                .build()
                .toUriString()

            response.sendRedirect(redirectUrl)
            return
        }

        // 기존 회원 → 바로 로그인 처리
        val accessToken = jwtTokenProvider.generateAccessToken(
            existingMember.id!!,
            existingMember.role
        )

        val refreshToken = jwtTokenProvider.generateRefreshToken(
            existingMember.id!!,
            existingMember.role
        )

        // Refresh Token → HttpOnly Cookie 저장
        cookieManager.addRefreshTokenCookie(
            response = response,
            token = refreshToken,
            maxAgeSeconds = jwtTokenProvider.refreshTokenExpireTime
        )

        // Access Token은 URL 파라미터 or 헤더로 전달
        val redirectUrl = UriComponentsBuilder
            .fromUriString("http://localhost:3000/login/success")
            .queryParam("accessToken", accessToken)
            .build()
            .toUriString()

        response.sendRedirect(redirectUrl)
    }
}