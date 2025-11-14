package com.backend.domain.review.dto

import com.backend.domain.review.entity.Review
import java.time.LocalDateTime


data class ReviewResponseDto(
    val memberId: String?,
    val reviewId: Long?,
    val rating: Int?,
    val modify_date: LocalDateTime?,
    val category: String?,
    val placeName: String?,
    val address: String?,
    val gu: String?

) {
    companion object {
        fun from(review: Review): ReviewResponseDto {
            val member = review.member
            val place = review.place
            return ReviewResponseDto(
                memberId = member.memberId,
                reviewId = requireNotNull(review.id) { "Review must be persisted before mapping to DTO." },
                rating = review.rating,
                modify_date = review.modifiedDate,
                category = place.category.name,
                placeName = place.placeName,
                address = place.address,
                gu = place.gu
            )
        }
    }
}
