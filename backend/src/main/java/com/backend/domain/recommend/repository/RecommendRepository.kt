package com.backend.domain.recommend.repository

import com.backend.domain.recommend.entity.Recommend
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface RecommendRepository : JpaRepository<Recommend?, Long?> {
    fun findByPlaceId(placeId: Long?): Optional<Recommend?>?

    fun findByPlaceCategoryNameOrderByBayesianRatingDesc(categoryName: String?): MutableList<Recommend?>? // 카테고리별 추천 장소 조회

    fun findTop5ByPlaceCategoryNameOrderByBayesianRatingDesc(categoryName: String?): MutableList<Recommend?>? // 카테고리별 상위 5개 추천 장소 조회
    //    Recommend findByPlaceId(Long placeId);
}
