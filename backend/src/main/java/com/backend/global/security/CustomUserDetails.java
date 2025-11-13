/*
package com.backend.global.security;

import com.backend.domain.member.entity.Member;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
public class CustomUserDetails implements UserDetails {

    private final Long id;           // Member PK
    private final String memberId;   // 로그인 ID
    private final String password;
    private final String nickname;
    private final String role;

    public CustomUserDetails(Member member) {
        this.id = member.getId();
        this.memberId = member.getMemberId();
        this.password = member.getPassword();
        this.nickname = member.getNickname();
        this.role = member.getRole().name();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(() -> "ROLE_" + role);
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return memberId; // 로그인용 ID 기준
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
*/
