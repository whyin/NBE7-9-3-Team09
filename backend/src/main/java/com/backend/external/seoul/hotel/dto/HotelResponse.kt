package com.backend.external.seoul.hotel.dto

data class HotelResponse(
    val list_total_count: Int?,          // 총 개수
    val row: List<HotelRow>?             // 호텔 목록
)