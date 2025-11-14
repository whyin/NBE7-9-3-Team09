package com.backend.domain.auth.dto.reponse;

public record TokenResponse(
        String accessToken,
        String refreshToken,
        long refreshTokenMaxAge,
        String role
) {
    public static TokenResponse of(String accessToken, String refreshToken, long refreshTokenMaxAge, String role) {
        return new TokenResponse(accessToken, refreshToken, refreshTokenMaxAge, role);
    }
}
