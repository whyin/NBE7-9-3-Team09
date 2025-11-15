package com.backend.domain.bookmark.dto

import com.backend.domain.bookmark.entity.Bookmark
import java.time.LocalDateTime

data class BookmarkResponseDto private constructor(
    val bookmarkId: Long,
    val memberId: Long,
    val placeId: Long,
    val placeName: String,
    val address: String?,
    val createdAt: LocalDateTime,
    val deletedAt: LocalDateTime?
) {
    constructor(bookmark: Bookmark) : this(
        bookmark.bookmarkId!!,
        bookmark.member.id!!,
        bookmark.place.id!!,
        bookmark.place.placeName,
        bookmark.place.address,
        bookmark.createdAt,
        bookmark.deletedAt
    )
}
