package com.backend.domain.auth.util

import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseCookie

object CookieManager {

    private const val COOKIE_NAME = "refreshToken"

    /** RefreshToken 쿠키 생성 */
    fun addRefreshTokenCookie(response: HttpServletResponse, token: String, maxAgeSeconds: Long) {
        val refreshCookie = ResponseCookie.from(COOKIE_NAME, token)
            .httpOnly(true)
            .secure(true)
            .sameSite("None")
            .path("/")
            .maxAge(maxAgeSeconds)
            .build()

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString())
    }

    /** RefreshToken 쿠키 삭제 */
    fun deleteRefreshTokenCookie(response: HttpServletResponse) {
        val cookie = ResponseCookie.from(COOKIE_NAME, "")
            .path("/")
            .maxAge(0)
            .build()

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString())
    }
}