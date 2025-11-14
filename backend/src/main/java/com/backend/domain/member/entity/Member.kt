package com.backend.domain.member.entity

import com.backend.global.entity.BaseEntity
import jakarta.persistence.*
import lombok.*
import java.time.LocalDateTime

@Entity
@Table(name = "member")
class Member(
    @Column(nullable = false, unique = true, length = 30)
    val memberId: String, // 로그인용 아이디

    @Column(nullable = false)
    var password: String, // 암호화된 비밀번호

    @Column(nullable = false, unique = true, length = 200)
    var email: String, // 중복 가입 방지

    @Column(nullable = false, unique = true, length = 20)
    var nickname: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    var role: Role,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    var status: MemberStatus = MemberStatus.ACTIVE,

    @Column(name = "deleted_at")
    private var deletedAt: LocalDateTime? = null
) : BaseEntity() {
    //TODO: name

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
        protected set // 외부 수정 금지 (DB에서 자동 생성만 허용)

    val isDeleted: Boolean
        get() = deletedAt != null

    fun delete() {
        check(this.status != MemberStatus.DELETED) { "이미 탈퇴한 회원입니다." }
        this.status = MemberStatus.DELETED
        this.deletedAt = LocalDateTime.now()
    }

    fun updatePassword(newPassword: String) {
        this.password = newPassword
    }

    fun updateNickname(newNickname: String) {
        this.nickname = newNickname
    }

    fun updateEmail(newEmail: String) {
        this.email = newEmail
    }

    // === Builder 사용을 위한 팩토리 ===
    companion object {
        @JvmStatic
        fun builder() = Builder()
    }

    class Builder {
        private var id: Long? = null
        private var memberId: String = ""
        private var password: String = ""
        private var email: String = ""
        private var nickname: String = ""
        private var role: Role = Role.USER
        private var status: MemberStatus = MemberStatus.ACTIVE
        private var deletedAt: LocalDateTime? = null

        fun id(id: Long?) = apply { this.id = id }
        fun memberId(memberId: String) = apply { this.memberId = memberId }
        fun password(password: String) = apply { this.password = password }
        fun email(email: String) = apply { this.email = email }
        fun nickname(nickname: String) = apply { this.nickname = nickname }
        fun role(role: Role) = apply { this.role = role }
        fun status(status: MemberStatus) = apply { this.status = status }
        fun deletedAt(deletedAt: LocalDateTime?) = apply { this.deletedAt = deletedAt }

        fun build(): Member {
            return Member(
                memberId = memberId,
                password = password,
                email = email,
                nickname = nickname,
                role = role,
                status = status,
                deletedAt = deletedAt
            )
        }
    }

}
