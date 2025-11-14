package com.backend.domain.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "refresh_token")
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberPk;          // Member의 PK(id)와 연결 not memberId

    @Column(nullable = false, unique = true, length = 512)
    private String token;           // 실제 Refresh Token 값

    @Column(nullable = false)
    private LocalDateTime issuedAt; // 발급 시간

    @Column(nullable = false)
    private LocalDateTime expiry;   // 만료일시

    // 토큰 갱신 시 사용
    public void updateToken(String newToken, LocalDateTime newExpiry) {
        this.token = newToken;
        this.expiry = newExpiry;
    }
}
