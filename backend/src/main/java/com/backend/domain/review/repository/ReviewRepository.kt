package com.backend.domain.review.repository

import com.backend.domain.review.entity.Review
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*

interface ReviewRepository : JpaRepository<Review, Long> {
    // 특정 회원이 특정 장소에 남긴 리뷰가 있는지 확인하는 메서드
    fun findByMemberIdAndPlaceId(memberId: Long, placeId: Long): Review?
    fun findByPlaceId(placeId: Long): List<Review>
    fun findAllByMemberId(memberId: Long?): List<Review>
    fun findByMember_IdAndPlace_Id(memberId: Long, placeId: Long): Review?
    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.place.id = :placeId")
    fun findAverageRatingByPlaceId(@Param("placeId") placeId: Long?): Double
}
