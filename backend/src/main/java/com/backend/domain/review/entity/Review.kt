package com.backend.domain.review.entity

import com.backend.domain.member.entity.Member
import com.backend.domain.place.entity.Place
import jakarta.persistence.*
import lombok.Getter
import lombok.NoArgsConstructor
import java.time.LocalDateTime

@Entity
@Table(name = "review")
class Review(
    @field:JoinColumn(name = "place_id", nullable = false )
    @field:ManyToOne
    var place: Place,

    @field:JoinColumn(name = "member_id", nullable = false)
    @field:ManyToOne
    var member: Member,

    @field:Column(nullable = false)
    var rating: Int


) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null


    @Column(nullable = false, name = "created_date")
    var createdDate: LocalDateTime? = null

    @Column(nullable = false, name = "modified_date")
    var modifiedDate: LocalDateTime? = null

    fun onCreate() {
        this.createdDate = LocalDateTime.now()
        this.modifiedDate = LocalDateTime.now()
    }

    fun onUpdate() {
        this.modifiedDate = LocalDateTime.now()
    }


    init {
        this.createdDate = LocalDateTime.now()
    }

}
