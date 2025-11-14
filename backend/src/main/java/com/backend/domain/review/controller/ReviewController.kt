package com.backend.domain.review.controller

import com.backend.domain.auth.service.AuthService
import com.backend.domain.review.dto.RecommendResponse
import com.backend.domain.review.dto.ReviewRequestDto
import com.backend.domain.review.dto.ReviewResponseDto
import com.backend.domain.review.service.ReviewService
import com.backend.global.response.ApiResponse
import lombok.RequiredArgsConstructor
import org.springframework.http.HttpHeaders
import org.springframework.web.bind.annotation.*


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/review")
class ReviewController (

    private val reviewService: ReviewService,
    private val authService: AuthService

){

    //리뷰 등록
    @PostMapping("/add")
    fun createReview(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) accessToken: String?,
        @RequestBody reviewRequestDto: ReviewRequestDto
    ): ApiResponse<ReviewResponseDto?> {
        val memberId = authService.getMemberId(accessToken)
        val createdReview = reviewService.createReview(reviewRequestDto, memberId)
        return ApiResponse.created<ReviewResponseDto?>(createdReview)
    }

    //리뷰 수정
    @PatchMapping("/modify/{memberId}")
    fun modifyReview(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) accessToken: String?,
        @PathVariable memberId: Long, @RequestParam modifyRating: Int
    ): ApiResponse<Void?> {
        val authMemberId = authService.getMemberId(accessToken)
        reviewService.modifyReview(authMemberId, modifyRating)
        return ApiResponse.success<Void?>()
    }

    //리뷰 삭제
    @DeleteMapping("/delete/{reviewId}")
    fun deleteReview(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) accessToken: String?,
        @PathVariable reviewId: Long
    ): ApiResponse<Void?> {
        val memberId = authService.getMemberId(accessToken)
        reviewService.deleteReview(memberId, reviewId)
        return ApiResponse.success<Void?>()
    }

    // 내가 작성한 리뷰 조회
    @GetMapping("/myReview") // 꼭 reviewId가 필요한가?
    fun getMyReview(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) accessToken: String?
    ): ApiResponse<List<ReviewResponseDto?>?> {
        val memberId = authService.getMemberId(accessToken)
        val response: List<ReviewResponseDto?> = reviewService.getMyReviews(memberId)
        //        ReviewResponseDto response = reviewService.getReview(memberId, reviewId);
        return ApiResponse.success<List<ReviewResponseDto?>?>(response)
    }

    // 특정 여행지의 리뷰 조회
    @GetMapping("/list/{placeId}")
    fun getPlaceReview(@PathVariable placeId: Long): ApiResponse<List<ReviewResponseDto?>?> {
        val reviews: List<ReviewResponseDto?> = reviewService.getReviewList(placeId)
        return ApiResponse.success<List<ReviewResponseDto?>?>(reviews)
    }

    @GetMapping("/lists")
    fun getAllReviews(): ApiResponse<List<ReviewResponseDto>> {
        val reviews: List<ReviewResponseDto> = reviewService.allReviews
        return ApiResponse.success(reviews)
    }

    //추천리뷰 -> 평균 별점 상위 5개의 여행지를 추천
    @GetMapping("/recommend/{placeId}")
    fun getRecommendedReviews(@PathVariable placeId: Long): ApiResponse<List<RecommendResponse?>?> {
        val recommendedPlaces: List<RecommendResponse?> = reviewService.recommendByPlace(placeId)
        return ApiResponse.success<List<RecommendResponse?>?>(recommendedPlaces)
    }

    //카테고리 - 호텔
    @GetMapping("/recommend/hotel")
    fun recommendHotelReviews(): ApiResponse<List<RecommendResponse?>?> {
        val recommendedPlaces: List<RecommendResponse?> = reviewService.recommendHotel()
        return ApiResponse.success<List<RecommendResponse?>?>(recommendedPlaces)
    }

    //카테고리 - 맛집
    @GetMapping("/recommend/restaurant")
    fun recommendRestaurantReviews(): ApiResponse<List<RecommendResponse?>?> {
        val recommendedPlaces: List<RecommendResponse?> = reviewService.recommendRestaurant()
        return ApiResponse.success<List<RecommendResponse?>?>(recommendedPlaces)
    }

    //카테고리 - 야경
    @GetMapping("/recommend/nightspot")
    fun recommendNightspotReviews(): ApiResponse<List<RecommendResponse?>?> {
        val recommendedPlaces: List<RecommendResponse?> = reviewService.recommendNightSpot()
        return ApiResponse.success<List<RecommendResponse?>?>(recommendedPlaces)
    }

    //카테고리 - 호텔
    @GetMapping("/recommend/allHotel")
    fun sortAllHotelReviews(): ApiResponse<List<RecommendResponse?>?> {
        val recommendedPlaces: List<RecommendResponse?> = reviewService.sortAllHotelReviews()
        return ApiResponse.success<List<RecommendResponse?>?>(recommendedPlaces)
    }

    //카테고리 - 맛집
    @GetMapping("/recommend/allRestaurant")
    fun sortAllRestaurantReviews(): ApiResponse<List<RecommendResponse?>?> {
        val recommendedPlaces: List<RecommendResponse?> = reviewService.sortAllRestaurantReviews()
        return ApiResponse.success<List<RecommendResponse?>?>(recommendedPlaces)
    }

    //카테고리 - 야경
    @GetMapping("/recommend/allNightspot")
    fun sortAllNightspotReviews(): ApiResponse<List<RecommendResponse?>?> {
        val recommendedPlaces: List<RecommendResponse?> = reviewService.sortAllNightSpotReviews()
        return ApiResponse.success<List<RecommendResponse?>?>(recommendedPlaces)
    }
}
