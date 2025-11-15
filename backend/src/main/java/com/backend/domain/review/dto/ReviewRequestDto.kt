package com.backend.domain.review.dto


data class ReviewRequestDto(
    val memberId: Long,
    val placeId: Long,
    val rating: Int,
    val Category: String,
    val placeName: String,
    val address: String,
    val gu: String

)
