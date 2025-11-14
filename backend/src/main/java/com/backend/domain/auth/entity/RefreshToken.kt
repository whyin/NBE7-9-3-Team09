package com.backend.domain.auth.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "refresh_token")
class RefreshToken(
    memberPk: Long,
    token: String,
    issuedAt: LocalDateTime,
    expiry: LocalDateTime
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
        protected set

    @Column(nullable = false)
    var memberPk: Long = memberPk
        protected set

    @Column(nullable = false, unique = true, length = 512)
    var token: String = token
        protected set

    @Column(nullable = false)
    var issuedAt: LocalDateTime = issuedAt
        protected set

    @Column(nullable = false)
    var expiry: LocalDateTime = expiry
        protected set

    /** RefreshToken 갱신 로직 */
    fun updateToken(newToken: String, newExpiry: LocalDateTime) {
        this.token = newToken
        this.expiry = newExpiry
        this.issuedAt = LocalDateTime.now()
    }

    companion object {
        fun create(memberPk: Long, token: String, expiry: LocalDateTime): RefreshToken {
            return RefreshToken(
                memberPk = memberPk,
                token = token,
                issuedAt = LocalDateTime.now(),
                expiry = expiry
            )
        }
    }
}
