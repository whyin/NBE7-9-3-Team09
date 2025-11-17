package com.backend.domain.bookmark.controller

import com.backend.domain.auth.service.AuthService
import com.backend.domain.bookmark.dto.BookmarkRequestDto
import com.backend.domain.bookmark.dto.BookmarkResponseDto
import com.backend.domain.bookmark.service.BookmarkService
import com.backend.global.response.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpHeaders
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/bookmarks")
class BookmarkController(
    private val bookmarkService: BookmarkService,
    private val authService: AuthService
) {

    /**
     * POST /api/bookmarks
     * body: { "placeId": 10 }
     */
    @PostMapping
    fun create(
        @RequestHeader(HttpHeaders.AUTHORIZATION) accessToken: String,
        @RequestBody @Valid request: BookmarkRequestDto
    ): ApiResponse<BookmarkResponseDto> {
        val memberId = authService.getMemberId(accessToken)
        val response = bookmarkService.create(request, memberId)

        return ApiResponse.created(response)
    }

    /**
     * GET /api/bookmarks
     */
    @GetMapping
    fun list(
        @RequestHeader(HttpHeaders.AUTHORIZATION) accessToken: String
    ): ApiResponse<List<BookmarkResponseDto>> {
        val memberId = authService.getMemberId(accessToken)
        val list = bookmarkService.getList(memberId)
        return ApiResponse.success(list)
    }

    /**
     * DELETE /api/bookmarks/{bookmarkId}
     */
    @DeleteMapping("/{bookmarkId}")
    fun delete(
        @RequestHeader(HttpHeaders.AUTHORIZATION) accessToken: String,
        @PathVariable bookmarkId:Long
    ): ApiResponse<Long> {
        val memberId = authService.getMemberId(accessToken)
        bookmarkService.delete(memberId, bookmarkId)
        return ApiResponse.success(bookmarkId)
    }
}
