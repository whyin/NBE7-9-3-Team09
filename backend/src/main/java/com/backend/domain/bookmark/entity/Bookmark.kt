package com.backend.domain.bookmark.entity

import com.backend.domain.member.entity.Member
import com.backend.domain.place.entity.Place
import jakarta.persistence.*
import lombok.AccessLevel
import lombok.AllArgsConstructor
import lombok.Getter
import lombok.NoArgsConstructor
import java.time.LocalDateTime

@Entity
@Table(name = "bookmarks", uniqueConstraints = [UniqueConstraint(columnNames = ["member_id", "place_id"])])
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
class Bookmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookmark_id", nullable = false)
    private var bookmarkId: Long? = null

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private var member: Member? = null

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "place_id", nullable = false)
    private var place: Place? = null

    @Column(name = "create_date", nullable = false)
    private var createdAt: LocalDateTime? = null

    @Column(name = "delete_date")
    private var deletedAt: LocalDateTime? = null

    @PrePersist
    protected fun onCreate() {
        this.createdAt = LocalDateTime.now()
    }

    fun delete() {
        this.deletedAt = LocalDateTime.now()
    }

    fun reactivate() {
        this.deletedAt = null
        this.createdAt = LocalDateTime.now()
    }

    val isDeleted: Boolean
        get() = this.deletedAt != null

    companion object {
        @JvmStatic
        fun create(member: Member?, place: Place?): Bookmark {
            val bookmark = Bookmark()
            bookmark.member = member
            bookmark.place = place
            return bookmark
        }
    }
}
