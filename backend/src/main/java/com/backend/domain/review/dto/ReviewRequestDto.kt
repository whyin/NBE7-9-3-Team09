package com.backend.domain.review.dto


data class ReviewRequestDto(
    val memberId: Long,
    val placeId: Long,
    val rating: Int,
    val content: String,
    val category: String? = null, // ✅ 소문자! JSON 키랑 맞추기
    val placeName: String? = null,
    val address: String? = null,
    val gu: String? = null,

)
