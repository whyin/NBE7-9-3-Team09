package com.backend.domain.review.service

import com.backend.domain.category.entity.Category
import com.backend.domain.category.repository.CategoryRepository
import com.backend.domain.member.entity.Member
import com.backend.domain.member.repository.MemberRepository
import com.backend.domain.place.entity.Place
import com.backend.domain.place.repository.PlaceRepository
import com.backend.domain.review.dto.RecommendResponse
import com.backend.domain.review.dto.RecommendResponse.Companion.from
import com.backend.domain.review.dto.ReviewRequestDto
import com.backend.domain.review.dto.ReviewResponseDto
import com.backend.domain.review.entity.Review
import com.backend.domain.review.repository.ReviewRepository
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import java.util.Map
import java.util.function.Supplier

@Service
class ReviewService (
    private val reviewRepository: ReviewRepository,
    private val memberRepository: MemberRepository,
    private val placeRepository: PlaceRepository,
    private val categoryRepository: CategoryRepository,
    ){
    //리뷰 생성 메서드
    @Transactional
    fun createReview(dto: ReviewRequestDto, memberId: Long): ReviewResponseDto {
//        val placeId: Long = reviewRequestDto.placeId!!

        val member = getMemberEntity(memberId)
        val place = getPlaceEntity(dto.placeId)

        val mid = requireNotNull(member.id) {"Member must be persisted" }
        val pid = requireNotNull(place.id) {"Place must be persisted" }

        reviewRepository.findByMember_IdAndPlace_Id(mid, pid)?.let {
            throw BusinessException(ErrorCode.GIVEN_REVIEW)
        }
        val review = Review(place = place, member = member, rating = dto.rating).apply { onCreate() }
        val saved = reviewRepository.save(review)
        return ReviewResponseDto.from(saved)

    }

    //리뷰 수정 메서드
    @Transactional
    fun modifyReview(memberId: Long, modifyRating: Int) {
        val review = getReviewWithAuth(memberId)
        review.rating = modifyRating
        review.onUpdate()
    }

    //리뷰 삭제 메서드
    @Transactional
    fun deleteReview(memberId: Long, reviewId: Long) {
        if (!validWithReviewId(memberId, reviewId)) {
            throw BusinessException(ErrorCode.ACCESS_DENIED)
        }
        val review = getReviewEntity(reviewId)
        reviewRepository.delete(review)
    }

    //내가 작성한 리뷰 조회
    fun getMyReviews(memberId: Long): List<ReviewResponseDto?> {
        val myReviews: List<Review> = reviewRepository.findAllByMemberId(memberId)
        if (myReviews.isEmpty()) {
            throw BusinessException(ErrorCode.NOT_FOUND_REVIEW)
        }
        return myReviews.map{ ReviewResponseDto.from(it)  }
    }

    val allReviews: List<ReviewResponseDto>
        //전체 리뷰 조회
        get() = reviewRepository.findAll()
            .map{ ReviewResponseDto.from(it)  }

    //여행지의 전체 리뷰 조회
    fun getReviewList(placeId: Long): List<ReviewResponseDto?> {
        return reviewRepository.findByPlaceId(placeId)
            .map{ ReviewResponseDto.from(it)  }
    }

    //"RESTAURANT", "LODGING", "NIGHTSPOT"
    @Transactional(readOnly = true)
    fun recommendHotel(topN: Int = 5): List<RecommendResponse> {
        val category = categoryRepository.findByName("HOTEL")
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_CATEGORY) }

        // getAllPlacesAndCalculate(category): List<Pair<Long, Double>> 를 사용한다고 가정
        return getAllPlacesAndCalculate(category)
            .take(topN)
            .map { (placeId, avg) ->
                val place = getPlaceEntity(placeId)
                RecommendResponse.from(place, avg)
            }
    }

    fun recommendByPlace(placeId: Long, topN: Int = 5): List<RecommendResponse> {
        val base = getPlaceEntity(placeId)
        val categoryName = base.category.name

        return placeRepository.findByCategory_Name(categoryName)
            .filter { it.id != placeId } // 자기 자신 제외
            .map { it.id to (reviewRepository.findAverageRatingByPlaceId(it.id) ?: 0.0) }
            .sortedByDescending { it.second }
            .take(topN)
            .map { (pid, avg) -> RecommendResponse.from(getPlaceEntity(pid), avg) }
    }


    fun getReviewEntity(reviewId: Long): Review =
        reviewRepository.findById(reviewId)
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_REVIEW) }

    fun getPlaceEntity(placeId: Long): Place =
        placeRepository.findById(placeId)
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_PLACE) }

    fun getMemberEntity(memberId: Long): Member =
        memberRepository.findById(memberId)
            .orElseThrow { BusinessException(ErrorCode.MEMBER_NOT_FOUND) }

    fun getReviewWithAuth(memberId: Long): Review {
        val member = getMemberEntity(memberId)
        val reviews: List<Review> = reviewRepository.findAllByMemberId(member.id)
        if (reviews.isEmpty()) {
            throw BusinessException(ErrorCode.NOT_FOUND_REVIEW)
        }

        return reviews.get(0)
    }

    fun validWithReviewId(memberId: Long, reviewId: Long): Boolean {
        val review = getReviewEntity(reviewId)
        val member = getMemberEntity(memberId)
        return review.member.id == member.id
    }


    @Transactional(readOnly = true)
    fun recommendRestaurant(topN: Int = 5): List<RecommendResponse> {
        val category = categoryRepository.findByName("맛집")
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_CATEGORY) }

        return getAllPlacesAndCalculate(category)       // List<Pair<Long, Double>>
            .take(topN)
            .map { (placeId, avg) ->
                val place = getPlaceEntity(placeId)
                RecommendResponse.from(place, avg)
            }
    }

    fun getAllPlacesAndCalculate(category: Category): List<Pair<Long, Double>> {
        return placeRepository.findByCategory_Name(category.name)
            .map { place ->
                val pid = requireNotNull(place.id) { "Place must be persisted" }
                val avg = reviewRepository.findAverageRatingByPlaceId(pid) ?: 0.0
                pid to avg
            }
            .sortedByDescending { it.second }
    }

    @Transactional(readOnly = true)
    fun sortAllHotelReviews(): List<RecommendResponse> {
        val category = categoryRepository.findByName("HOTEL")
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_CATEGORY) }

        // getAllPlacesAndCalculate(category): List<Pair<Long, Double>> 를 사용한다고 가정
        return getAllPlacesAndCalculate(category)
            .map { (placeId, avg) ->
                val place = placeRepository.findById(placeId)
                    .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_PLACE) }
                RecommendResponse.from(place, avg)
            }
    }

    @Transactional(readOnly = true)
    fun sortAllNightSpotReviews(): List<RecommendResponse> {
        val category = categoryRepository.findByName("NIGHTSPOT")
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_CATEGORY) }

        // getAllPlacesAndCalculate(category): List<Pair<Long, Double>> 가정
        return getAllPlacesAndCalculate(category)
            .map { (placeId, avg) ->
                val place = placeRepository.findById(placeId)
                    .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_PLACE) }
                RecommendResponse.from(place, avg)
            }
    }

    fun sortAllRestaurantReviews(): List<RecommendResponse> {
        val category = categoryRepository.findByName("맛집").orElseThrow{
            BusinessException(ErrorCode.NOT_FOUND_CATEGORY)
        }

        return getAllPlacesAndCalculate(category)
            .map { (placeId, avg) ->
                val place = placeRepository.findById(placeId)
                    .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_PLACE) }
                RecommendResponse.from(place, avg)
            }
    }

    @Transactional(readOnly = true)
    fun recommendNightSpot(topN: Int = 5): List<RecommendResponse> {
        val category = categoryRepository.findByName("NIGHTSPOT")
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_CATEGORY) }

        return getAllPlacesAndCalculate(category)          // List<Pair<Long, Double>>
            .take(topN)                                   // 상위 N개
            .map { (placeId, avg) ->
                val place = getPlaceEntity(placeId)
                RecommendResponse.from(place, avg)
            }
    }
}