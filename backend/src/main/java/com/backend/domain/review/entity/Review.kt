package com.backend.domain.review.entity

import com.backend.domain.member.entity.Member
import com.backend.domain.place.entity.Place
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "review",
    indexes = [
        Index(
            name = "idx_review_place_rating",
            columnList = "place_id, rating"
        ),
        Index(
            name = "ux_review_member_place",
            columnList = "member_id, place_id",
            unique = true
        )
    ]
)
class Review(

    @field:ManyToOne
    @field:JoinColumn(name = "place_id", nullable = false)
    var place: Place,

    @field:ManyToOne
    @field:JoinColumn(name = "member_id", nullable = false)
    var member: Member,

    @field:Column(nullable = false)
    var rating: Int,

    @field:Column(nullable = false)
    var content: String

) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

    @Column(nullable = false, name = "created_date")
    var createdDate: LocalDateTime = LocalDateTime.now()

    @Column(nullable = false, name = "modified_date")
    var modifiedDate: LocalDateTime = LocalDateTime.now()

    fun onCreate() {
        val now = LocalDateTime.now()
        this.createdDate = now
        this.modifiedDate = now
    }

    fun onUpdate() {
        this.modifiedDate = LocalDateTime.now()
    }
}
