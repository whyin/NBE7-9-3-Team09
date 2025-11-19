package com.backend.domain.member.entity

import com.backend.global.entity.BaseEntity
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "member")
class Member(

    /* === 소셜 로그인 정보 === */
    @Enumerated(EnumType.STRING)
    @Column(nullable = true, length = 20)
    val provider: Provider? = null,  // LOCAL, KAKAO, GOOGLE…

    @Column(nullable = true, unique = true)
    val providerId: String? = null, // 소셜 로그인 고유 ID (카카오: kakao id)

    /* === 일반/소셜 공통 정보 === */
    @Column(nullable = false, unique = true, length = 30)
    val memberId: String, // 로그인용 아이디 / 카카오: 자동 생성

    @Column(nullable = false)
    var password: String, // 암호화된 비밀번호 / 카카오: "{SOCIAL_LOGIN}"

    @Column(nullable = false, unique = true, length = 200)
    val email: String, // 중복 가입 방지

    @Column(nullable = false, unique = true, length = 20)
    var nickname: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    var role: Role = Role.USER,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    var status: MemberStatus = MemberStatus.ACTIVE,

    @Column(name = "deleted_at")
    private var deletedAt: LocalDateTime? = null
) : BaseEntity() {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
        protected set // 외부 수정 금지 (DB에서 자동 생성만 허용)

    /* === 비즈니스 로직 === */

    val isDeleted: Boolean
        get() = deletedAt != null

    fun delete() {
        check(this.status != MemberStatus.DELETED) { "이미 탈퇴한 회원입니다." }
        this.status = MemberStatus.DELETED
        this.deletedAt = LocalDateTime.now()
    }

    // TODO: 일단 사용 안 함 
    fun updatePassword(newPassword: String) {
        this.password = newPassword
    }

    fun updateNickname(newNickname: String) {
        this.nickname = newNickname
    }

    companion object {

        /* === 정적 팩토리: 일반 회원 생성 === */
        fun createLocal(
            memberId: String,
            password: String,
            email: String,
            nickname: String
        ): Member {
            return Member(
                provider = Provider.LOCAL,
                providerId = null,
                memberId = memberId,
                password = password,
                email = email,
                nickname = nickname,
                role = Role.USER,
                status = MemberStatus.ACTIVE
            )
        }

        /* === 정적 팩토리: 카카오 회원 생성 === */
        fun createKakao(
            providerId: String,
            email: String,
            nickname: String
        ): Member {
            return Member(
                provider = Provider.KAKAO,
                providerId = providerId,
                memberId = "kakao_" + UUID.randomUUID().toString().replace("-", "").take(16),      // 자동 생성
                password = "{SOCIAL_LOGIN}",         // 소셜 회원 dummy PW
                email = email,
                nickname = nickname,
                role = Role.USER,
                status = MemberStatus.ACTIVE
            )
        }
    }
}
