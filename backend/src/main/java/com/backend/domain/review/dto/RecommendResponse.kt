package com.backend.domain.review.dto

import com.backend.domain.place.entity.Place

data class RecommendResponse(
    val id: Long?,
    val placeName: String?,
    val address: String?,
    val gu: String?,
    val category: String?,
    val description: String?,
    val averageRating: Double?
) {
    companion object {
        @JvmStatic
        fun from(place: Place, averageRating: Double): RecommendResponse {
            return RecommendResponse(
                place.id,
                place.placeName,
                place.address,
                place.gu,
                place.category.name,
                place.description,
                averageRating = averageRating
            )
        }
    }
}
