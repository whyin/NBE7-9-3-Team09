package com.backend.external.seoul.hotel.dto

data class HotelRow(
    val NAME_KOR: String?,     // 호텔 이름
    val H_KOR_CITY: String?,   // 시
    val H_KOR_GU: String?,     // 구
    val H_KOR_DONG: String?,   // 동
    val CATE3_NAME: String?    // 상세 카테고리
)