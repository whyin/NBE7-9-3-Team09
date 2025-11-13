/*
package com.backend.global.jwt;

import com.backend.domain.member.entity.Role;
import com.backend.global.security.CustomUserDetails;
import com.backend.global.security.CustomUserDetailsService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Getter
@Component
@Slf4j
public class JwtTokenProvider {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Value("${custom.jwt.secret-key}")
    private String secretKey;

    @Value("${custom.jwt.access-token.expire-time}")
    private long ACCESS_TOKEN_EXPIRE_TIME;

    @Value("${custom.jwt.refresh-token.expire-time}")
    private long REFRESH_TOKEN_EXPIRE_TIME;

    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // Access Token 생성 - 로그인 후 인증
    public String generateAccessToken(Long memberId, Role role) {
        return generateToken(memberId, role, ACCESS_TOKEN_EXPIRE_TIME, "access");
    }

    // Refresh Token 생성 - Access 만료 시 재발급
    public String generateRefreshToken(Long memberId, Role role) {
        return generateToken(memberId, role, REFRESH_TOKEN_EXPIRE_TIME, "refresh");
    }

    // 공통 토큰 생성 로직
    private String generateToken(Long memberId, Role role, long expireTime, String type) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expireTime);

        return Jwts.builder()
                .subject(String.valueOf(memberId))
                .issuedAt(now)
                .expiration(expiry)
                .claim("role", role.name())
                .claim("type", type)
                .signWith(key)
                .compact();
    }

    // 토큰 유효성 검증 (서명 검증 + 만료 체크)
    public TokenStatus validateTokenStatus(String token) {

        try {
            Jwts.parser().verifyWith(key).build().parse(token);
            return TokenStatus.VALID;
        } catch (ExpiredJwtException e) {
            log.info("== 토큰이 만료되었습니다 ==");
            return TokenStatus.EXPIRED;
        } catch (JwtException | IllegalArgumentException e) {
            log.info("== 유효하지 않은 토큰입니다 ==");
            return TokenStatus.INVALID;
        }
    }

    */
/** 토큰 파싱 관련 (Claims 읽기) *//*


    // Claims 파싱 (JWT → 내부 데이터 복호화 + 서명 검증)
    private Claims parseClaims(String token) {
        // parseSignedClaims(): JWT를 서명 검증 후 Payload(Claims) 반환
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // 토큰에서 memberId(subject) 추출
    public Long getMemberIdFromToken(String token) {
        // subject는 String으로 저장되어 있으므로 Long으로 변환
        return Long.valueOf(parseClaims(token).getSubject());
    }

    // 토큰에서 role 추출
    public Role getRoleFromToken(String token) {
        Object role = parseClaims(token).get("role");
        return Role.valueOf(role.toString());
    }

    // JWT → Authentication으로 변환 (스프링 시큐리티는 “Authentication 객체”를 기준으로 사용자 인증 여부를 판단)
    public Authentication getAuthentication(String token) {
        Long memberPk = getMemberIdFromToken(token);
        Role role = getRoleFromToken(token);

        // DB에서 Member 엔티티 조회 후 CustomUserDetails 생성
        CustomUserDetails userDetails =
                (CustomUserDetails) customUserDetailsService.loadUserById(memberPk);

        return new UsernamePasswordAuthenticationToken(
                userDetails,  // principal을 CustomUserDetails로
                null,
                userDetails.getAuthorities()
        );
    }

    // type 조회용 메서드 추가
    public String getTokenType(String token) {
        Object type = parseClaims(token).get("type");
        return type != null ? type.toString() : "unknown";
    }

    */
/** 토큰 만료시간 조회 (쿠키 설정 등에서 사용) *//*


    public long getAccessTokenExpireTime() {
        return ACCESS_TOKEN_EXPIRE_TIME / 1000; // 초 단위로 변환 (쿠키에서 사용하기 좋음)
    }

    public long getRefreshTokenExpireTime() {
        return REFRESH_TOKEN_EXPIRE_TIME / 1000;
    }
}
*/
