package com.backend.domain.bookmark.dto

import com.backend.domain.bookmark.entity.Bookmark
import lombok.Builder
import java.time.LocalDateTime

@Builder
@JvmRecord
data class BookmarkResponseDto(
    val bookmarkId: Long?,
    val memberId: Long?,
    val placeId: Long?,
    val placeName: String?,
    val address: String?,
    val createdAt: LocalDateTime?,
    val deletedAt: LocalDateTime?
) {
    companion object {
        @JvmStatic
        fun from(bookmark: Bookmark): BookmarkResponseDto? {
            return BookmarkResponseDto.builder()
                .bookmarkId(bookmark.getBookmarkId())
                .memberId(bookmark.getMember().getId())
                .placeId(bookmark.getPlace().getId())
                .placeName(bookmark.getPlace().getPlaceName())
                .address(bookmark.getPlace().getAddress())
                .createdAt(bookmark.getCreatedAt())
                .deletedAt(bookmark.getDeletedAt())
                .build()
        }
    }
}
