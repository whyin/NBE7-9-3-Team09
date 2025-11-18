package com.backend.domain.review.controller

import com.backend.domain.auth.service.AuthService
import com.backend.domain.review.dto.RecommendResponse
import com.backend.domain.review.dto.ReviewRequestDto
import com.backend.domain.review.dto.ReviewResponseDto
import com.backend.domain.review.service.ReviewService
import com.backend.global.response.ApiResponse
import org.springframework.http.HttpHeaders
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/review")
class ReviewController(
    private val reviewService: ReviewService,
    private val authService: AuthService
) {

    /**
     * 리뷰 등록
     */
    @PostMapping("/add")
    fun createReview(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) accessToken: String,
        @RequestBody reviewRequestDto: ReviewRequestDto
    ): ApiResponse<ReviewResponseDto> {
        val memberId = authService.getMemberId(accessToken)
        val createdReview = reviewService.createReview(reviewRequestDto, memberId)
        return ApiResponse.created(createdReview)
    }

    /**
     * 리뷰 수정
     */
    @PatchMapping("/modify/{reviewId}")
    fun modifyReview(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) accessToken: String,
        @PathVariable reviewId: Long,
        @RequestParam modifyRating: Int,
        @RequestParam modifyContent: String
    ): ApiResponse<Void?> {
        val memberId = authService.getMemberId(accessToken)
        reviewService.modifyReview(memberId, reviewId, modifyRating, modifyContent)
        return ApiResponse.success<Void>()
    }

    /**
     * 리뷰 삭제
     */
    @DeleteMapping("/delete/{reviewId}")
    fun deleteReview(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) accessToken: String,
        @PathVariable reviewId: Long
    ): ApiResponse<Void?> {
        val memberId = authService.getMemberId(accessToken)
        reviewService.deleteReview(memberId, reviewId)
        return ApiResponse.success<Void>()
    }

    /**
     * 내가 작성한 리뷰 조회
     */
    @GetMapping("/myReview")
    fun getMyReview(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) accessToken: String
    ): ApiResponse<List<ReviewResponseDto>> {
        val memberId = authService.getMemberId(accessToken)
        val reviews = reviewService.getMyReviews(memberId)
        return ApiResponse.success(reviews)
    }

    /**
     * 특정 여행지 리뷰 조회
     */
    @GetMapping("/list/{placeId}")
    fun getPlaceReview(
        @PathVariable placeId: Long
    ): ApiResponse<List<ReviewResponseDto>> {
        val reviews = reviewService.getReviewList(placeId)
        return ApiResponse.success(reviews)
    }

    /**
     * 전체 리뷰 조회
     */
    @GetMapping("/lists")
    fun getAllReview(): ApiResponse<List<ReviewResponseDto>> {
        val reviews = reviewService.getAllReviews()
        return ApiResponse.success(reviews)
    }

    /**
     * 카테고리별 추천 (Bayesian 상위 5)
     */
    @GetMapping("/recommend/{category}")
    fun recommendPlacesByCategory(
        @PathVariable category: String
    ): ApiResponse<List<RecommendResponse>> {
        val recommendedPlaces = reviewService.recommendPlace(category)
        return ApiResponse.success(recommendedPlaces)
    }

    /**
     * 카테고리별 내림차순 정렬 전체
     */
    @GetMapping("/recommend/sort/{category}")
    fun sortRecommendedPlacesByCategory(
        @PathVariable category: String
    ): ApiResponse<List<RecommendResponse>> {
        val recommendedPlaces = reviewService.sortPlaces(category)
        return ApiResponse.success(recommendedPlaces)
    }
}
