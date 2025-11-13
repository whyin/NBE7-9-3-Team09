package com.backend.domain.bookmark.controller

import com.backend.domain.auth.service.AuthService
import com.backend.domain.bookmark.dto.BookmarkRequestDto
import com.backend.domain.bookmark.dto.BookmarkResponseDto
import com.backend.domain.bookmark.service.BookmarkService
import com.backend.global.response.ApiResponse
import jakarta.validation.Valid
import lombok.RequiredArgsConstructor
import org.springframework.http.HttpHeaders
import org.springframework.web.bind.annotation.*

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookmarks")
class BookmarkController {
    private val bookmarkService: BookmarkService? = null
    private val authService: AuthService? = null

    /**
     * POST /api/bookmarks
     * body: { "placeId": 10 }
     */
    @PostMapping
    fun create(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) accessToken: String?,
        @RequestBody request: @Valid BookmarkRequestDto
    ): ApiResponse<BookmarkResponseDto?> {
        val memberId = authService!!.getMemberId(accessToken)

        val response = bookmarkService!!.create(request, memberId)
        return ApiResponse.created<BookmarkResponseDto?>(response)
    }

    /**
     * GET /api/bookmarks
     */
    @GetMapping
    fun list(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) accessToken: String?
    ): ApiResponse<MutableList<BookmarkResponseDto?>?> {
        val memberId = authService!!.getMemberId(accessToken)
        val list = bookmarkService!!.getList(memberId)
        return ApiResponse.success<MutableList<BookmarkResponseDto?>?>(list)
    }

    /**
     * DELETE /api/bookmarks/{bookmarkId}
     */
    @DeleteMapping("/{bookmarkId}")
    fun delete(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) accessToken: String?,
        @PathVariable bookmarkId: @Valid Long?
    ): ApiResponse<Long?> {
        val memberId = authService!!.getMemberId(accessToken)
        bookmarkService!!.delete(memberId, bookmarkId)
        return ApiResponse.success<Long?>(bookmarkId)
    }
}
