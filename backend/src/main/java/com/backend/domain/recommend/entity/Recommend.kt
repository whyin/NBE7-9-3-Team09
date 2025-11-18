package com.backend.domain.recommend.entity

import com.backend.domain.place.entity.Place
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "recommend")
class Recommend(

    @field:ManyToOne(fetch = FetchType.LAZY)
    @field:JoinColumn(name = "place_id", nullable = false)
    var place: Place,

    @field:Column(nullable = false)
    var averageRating: Double,

    @field:Column(nullable = false)
    var reviewCount: Long,

    @field:Column(nullable = false)
    var bayesianRating: Double

) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

    @Column(nullable = false, name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now()

    fun updateRecommend(averageRating: Double, reviewCount: Long, bayesianRating: Double) {
        this.averageRating = averageRating
        this.reviewCount = reviewCount
        this.bayesianRating = bayesianRating
        this.updatedAt = LocalDateTime.now()
    }

    companion object {
        fun create(place: Place, averageRating: Double, reviewCount: Long, bayesianRating: Double): Recommend {
            return Recommend(
                place = place,
                averageRating = averageRating,
                reviewCount = reviewCount,
                bayesianRating = bayesianRating
            )
        }
    }
}
