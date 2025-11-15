package com.backend.domain.bookmark.entity

import com.backend.domain.member.entity.Member
import com.backend.domain.place.entity.Place
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "bookmarks",
    uniqueConstraints = [UniqueConstraint(columnNames = ["member_id", "place_id"])]
)
class Bookmark(
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    val member: Member,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "place_id", nullable = false)
    val place: Place
) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var bookmarkId: Long? = null
        protected set  // JPA-friendly, 외부에서 직접 수정 금지

    var createdAt: LocalDateTime = LocalDateTime.now()
        protected set

    var deletedAt: LocalDateTime? = null
        protected set

    val isDeleted: Boolean
        get() = deletedAt != null

    /** 즐겨찾기 삭제 */
    fun delete() {
        this.deletedAt = LocalDateTime.now()
    }

    /** 즐겨찾기 복원 */
    fun reactivate() {
        this.deletedAt = null
        this.createdAt = LocalDateTime.now()
    }

    /** 권한 체크: member가 bookmark를 수정/삭제할 수 있는지 확인 */
    fun checkActor(actor: Member) {
        if (this.member != actor) {
            throw IllegalAccessException("권한이 없습니다.")
        }
    }

    companion object {
        /** 안전한 Bookmark 생성 */
        fun create(member: Member, place: Place) = Bookmark(member, place)
    }
}
