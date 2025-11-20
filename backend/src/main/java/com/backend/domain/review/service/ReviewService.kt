package com.backend.domain.review.service

import com.backend.domain.category.entity.Category
import com.backend.domain.category.repository.CategoryRepository
import com.backend.domain.member.entity.Member
import com.backend.domain.member.repository.MemberRepository
import com.backend.domain.place.entity.Place
import com.backend.domain.place.repository.PlaceRepository
import com.backend.domain.recommend.entity.Recommend
import com.backend.domain.recommend.repository.RecommendRepository
import com.backend.domain.review.dto.RecommendResponse
import com.backend.domain.review.dto.ReviewRequestDto
import com.backend.domain.review.dto.ReviewResponseDto
import com.backend.domain.review.entity.Review
import com.backend.domain.review.repository.ReviewRepository
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val memberRepository: MemberRepository,
    private val placeRepository: PlaceRepository,
    private val categoryRepository: CategoryRepository,
    private val recommendRepository: RecommendRepository,
) {

    /**
     * 리뷰 생성
     */
    @Transactional
    @CacheEvict(cacheNames = ["sortedPlaces"], allEntries = true)
    fun createReview(dto: ReviewRequestDto, memberId: Long): ReviewResponseDto {
        val member = getMemberEntity(memberId)
        val place = getPlaceEntity(dto.placeId)

        val mid = requireNotNull(member.id) { "Member must be persisted" }
        val pid = requireNotNull(place.id) { "Place must be persisted" }

        // 중복 리뷰 체크
        reviewRepository.findByMember_IdAndPlace_Id(mid, pid)?.let {
            throw BusinessException(ErrorCode.GIVEN_REVIEW)
        }

        // 리뷰 생성/저장
        val review = Review(
            place = place,
            member = member,
            rating = dto.rating,
            content = dto.content
        ).apply { onCreate() }

        val saved = reviewRepository.save(review)

        // place 통계 갱신
        place.ratingCount = place.ratingCount + 1
        place.ratingSum = place.ratingSum + dto.rating
        placeRepository.save(place)

        // Recommend 갱신
//        updateRecommend(place)

        // DTO 변환 (기존 from(..) 패턴 사용한다고 가정)
        return ReviewResponseDto.from(saved)
    }

    /**
     * 리뷰 수정
     */
    @Transactional
    @CacheEvict(cacheNames = ["sortedPlaces"], allEntries = true)
    fun modifyReview(memberId: Long, reviewId: Long, modifyRating: Int, content: String) {
        val review = reviewRepository.findByMemberIdAndId(memberId, reviewId)
            ?: throw BusinessException(ErrorCode.NOT_FOUND_REVIEW)

        val oldRating = review.rating

        review.rating = modifyRating
        review.content = content
        review.onUpdate()
        reviewRepository.save(review)

        // place 통계 갱신
        val place = getPlaceEntity(requireNotNull(review.place.id))
        place.ratingSum = place.ratingSum - oldRating + modifyRating
        placeRepository.save(place)

        // Recommend 갱신
//        updateRecommend(place)
    }

    /**
     * 리뷰 삭제
     */
    @Transactional
    @CacheEvict(cacheNames = ["sortedPlaces"], allEntries = true)
    fun deleteReview(memberId: Long, reviewId: Long) {
        if (!validWithReviewId(memberId, reviewId)) {
            throw BusinessException(ErrorCode.ACCESS_DENIED)
        }

        val review = getReviewEntity(reviewId)
        val place = getPlaceEntity(requireNotNull(review.place.id))

        // place 통계 갱신
        place.ratingCount = place.ratingCount - 1
        place.ratingSum = place.ratingSum - review.rating
        placeRepository.save(place)

        reviewRepository.delete(review)

        // Recommend 갱신
//        updateRecommend(place)
    }

    /**
     * 내가 작성한 리뷰 조회
     */
    fun getMyReviews(memberId: Long): List<ReviewResponseDto> {
        val myReviews = reviewRepository.findAllByMemberId(memberId)
        if (myReviews.isEmpty()) {
            throw BusinessException(ErrorCode.NOT_FOUND_REVIEW)
        }
        return myReviews.map { ReviewResponseDto.from(it) }
    }

    /**
     * 전체 리뷰 조회
     */
    fun getAllReviews(): List<ReviewResponseDto> =
        reviewRepository.findAll()
            .map { ReviewResponseDto.from(it) }

    /**
     * 특정 여행지의 리뷰 리스트
     */
    fun getReviewList(placeId: Long): List<ReviewResponseDto> =
        reviewRepository.findByPlaceId(placeId)
            .map { ReviewResponseDto.from(it) }

    // ───────────────── 헬퍼 메서드들 ─────────────────

    fun getReviewEntity(reviewId: Long): Review =
        reviewRepository.findById(reviewId)
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_REVIEW) }

    fun getPlaceEntity(placeId: Long?): Place =
        placeRepository.findById(placeId)
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_PLACE) }

    fun getMemberEntity(memberId: Long): Member =
        memberRepository.findById(memberId)
            .orElseThrow { BusinessException(ErrorCode.MEMBER_NOT_FOUND) }

    fun validWithReviewId(memberId: Long, reviewId: Long): Boolean {
        val review = getReviewEntity(reviewId)
        val member = getMemberEntity(memberId)
        return review.member.id == member.id
    }

    /**
     * (옛 로직용) 카테고리 내 place들의 평균 별점 계산
     * 필요하면 계속 사용, 아니면 지워도 됨
     */
    fun getAllPlacesAndCalculate(category: Category): List<Pair<Long, Double>> =
        placeRepository.findByCategory_Name(category.name)
            .map { place ->
                val pid = requireNotNull(place.id) { "Place must be persisted" }
                val avg = reviewRepository.findAverageRatingByPlaceId(pid) ?: 0.0
                pid to avg
            }
            .sortedByDescending { it.second }

    /**
     * 베이지안 가중치 계산
     */
    fun getWeightByBayesian(
        averageRating: Double,              // 특정 장소의 평균 평점
        reviewCount: Double,                // 특정 장소의 리뷰 개수
        globalAverageRating: Double         // 전체 리뷰의 평균 평점
    ): Double {
        val threshold = 10.0 // 가중치값 : 10 (10으로 고정한 이유 : 리뷰가 10개 이상이면 어느정도 신뢰할 수 있다고 판단)
        return (reviewCount / (reviewCount + threshold)) * averageRating +
                (threshold / (reviewCount + threshold)) * globalAverageRating
    }

    fun recommendPlace(categoryName: String): List<RecommendResponse?> {
        val sorted: List<RecommendResponse?> = sortPlaces(categoryName) // 캐시됨
        return sorted.stream().limit(5).toList()
    }

    // ───────────────── Recommend / 캐시 영역 ─────────────────

    @Cacheable(cacheNames = ["sortedPlaces"], key = "#categoryName")
    fun sortPlaces(categoryName: String): List<RecommendResponse> {
        val recommends = recommendRepository
            .findByPlaceCategoryNameOrderByBayesianRatingDesc(categoryName)

        return recommends.map {
            val place = it?.place ?: throw IllegalStateException("Recommend.place is null")
            RecommendResponse.from(place, it.bayesianRating)
        }
    }




    /**
     * 전체 리뷰의 글로벌 평균 평점
     */
    fun getGlobalAverageRating(): Double =
        reviewRepository.findGlobalAverageRating()

    /**
     * 특정 장소의 평균 평점
     */
    fun getAverageRating(placeId: Long): Double =
        reviewRepository.findAverageRating(placeId)

    /**
     * place/Review 통계를 기반으로 Recommend 엔티티 갱신
     */
    fun updateRecommend(place: Place) {
        val pid = requireNotNull(place.id) { "Place must be persisted" }

        val averageRating = getAverageRating(pid)
        val reviewCount: Long = reviewRepository.countByPlaceId(place.id)
        val globalAverageRating = getGlobalAverageRating()
        val weight = getWeightByBayesian(
            averageRating = averageRating,
            reviewCount = reviewCount.toDouble(),
            globalAverageRating = globalAverageRating
        )

        val recommend = recommendRepository.findByPlaceId(pid)
            ?.orElseGet { Recommend.create(place, averageRating, reviewCount, weight) }

        recommend?.updateRecommend(averageRating, reviewCount, weight)
        recommendRepository.save(recommend)

        // place에도 캐시용 통계 저장
        place.ratingAvg = weight
        place.ratingCount = reviewCount.toInt()
        placeRepository.save(place)
    }


    @Scheduled(cron = "0 */10 * * * ?") // 10분마다 실행
    @Transactional
    fun updateAllRecommend() {
        val places = placeRepository.findAll()

        places.forEach { place ->
            updateRecommend(place)
        }
    }

}
