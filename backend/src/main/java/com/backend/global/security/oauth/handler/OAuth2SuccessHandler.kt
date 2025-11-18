package com.backend.global.security.oauth.handler

import com.backend.domain.auth.dto.request.OAuthLoginResult
import com.backend.domain.auth.service.AuthService
import com.backend.domain.auth.util.CookieManager
import com.backend.domain.member.entity.Provider
import com.backend.global.security.jwt.JwtTokenProvider
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.stereotype.Component
import org.springframework.web.util.UriComponentsBuilder

@Component
class OAuth2SuccessHandler(
    private val jwtTokenProvider: JwtTokenProvider,
    private val cookieManager: CookieManager,
    private val authService: AuthService
) : AuthenticationSuccessHandler {

    private val log = KotlinLogging.logger {}

    override fun onAuthenticationSuccess(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authentication: Authentication
    ) {

        log.info { "🔥 [OAuth2SuccessHandler] 실행됨 — 카카오 로그인 성공 처리 시작" }

        val oAuth2User = authentication.principal as org.springframework.security.oauth2.core.user.OAuth2User
        log.info { "🔥 attributes = ${oAuth2User.attributes}" }

        // CustomOAuth2UserService에서 넣은 attributes
        val provider = Provider.valueOf(oAuth2User.attributes["provider"].toString())
        val providerId = oAuth2User.attributes["providerId"].toString()
        val email = oAuth2User.attributes["email"] as String?

        log.info { "🔥 provider=$provider providerId=$providerId email=$email" }

        val result = authService.handleOAuth2Login(provider, providerId, email)
        log.info { "🔥 OAuthLoginResult = $result" }

        when (result) {

            is OAuthLoginResult.NewUser -> {
                val redirectUrl = buildRedirectUrl(
                    baseUrl = "http://localhost:3000/oauth2/signup",
                    params = mapOf("token" to result.tempToken)
                )
                log.info { "🎯 신규 회원 — 프론트 회원가입 페이지로 리다이렉트: $redirectUrl" }
                response.sendRedirect(redirectUrl)
            }

            is OAuthLoginResult.ExistingUser -> {

                log.info { "🎯 기존 회원 — RefreshToken 쿠키 추가" }

                cookieManager.addRefreshTokenCookie(
                    response = response,
                    token = result.refresh,
                    maxAgeSeconds = jwtTokenProvider.refreshTokenExpireTime
                )

                val redirectUrl = buildRedirectUrl(
                    baseUrl = "http://localhost:3000/user",
                    params = mapOf("accessToken" to result.access)
                )

                log.info { "🎯 기존 회원 — 프론트 유저 페이지로 리다이렉트: $redirectUrl" }

                response.sendRedirect(redirectUrl)
            }
        }
    }

    private fun buildRedirectUrl(baseUrl: String, params: Map<String, String>): String {
        val builder = UriComponentsBuilder.fromUriString(baseUrl)
        params.forEach { (key, value) -> builder.queryParam(key, value) }
        return builder.build().toUriString()
    }
}