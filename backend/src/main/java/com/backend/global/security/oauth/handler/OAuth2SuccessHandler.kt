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

        val oAuth2User = authentication.principal as org.springframework.security.oauth2.core.user.OAuth2User

        // CustomOAuth2UserService에서 넣은 attributes
        val provider = Provider.valueOf(oAuth2User.attributes["provider"].toString())
        val providerId = oAuth2User.attributes["providerId"].toString()
        val email = oAuth2User.attributes["email"] as String?

        val result = authService.handleOAuth2Login(provider, providerId, email)

        when (result) {

            is OAuthLoginResult.NewUser -> {
                val redirectUrl = buildRedirectUrl(
                    baseUrl = "http://localhost:3000/oauth2/signup",
                    params = mapOf("token" to result.tempToken)
                )
                response.sendRedirect(redirectUrl)
            }

            is OAuthLoginResult.ExistingUser -> {

                cookieManager.addRefreshTokenCookie(
                    response = response,
                    token = result.refresh,
                    maxAgeSeconds = jwtTokenProvider.refreshTokenExpireTime
                )

                val redirectUrl = buildRedirectUrl(
                    baseUrl = "http://localhost:3000/user",
                    params = mapOf("accessToken" to result.access)
                )

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