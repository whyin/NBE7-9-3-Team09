package com.backend.domain.bookmark.dto

import jakarta.validation.constraints.NotNull

data class BookmarkRequestDto(
    @field:NotNull
    val placeId: Long
)
