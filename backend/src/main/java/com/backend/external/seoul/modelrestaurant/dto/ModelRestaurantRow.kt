package com.backend.external.seoul.modelrestaurant.dto

data class ModelRestaurantRow(
    val name: String,        // 업소명 (UPSO_NM)
    val address: String,     // 주소 (SITE_ADDR_RD 있으면 우선, 없으면 SITE_ADDR)
    val gu: String,          // 주소에서 "XX구" 추출
    val category: String,    // "맛집" 고정
    val description: String  // 업태 + 주된음식 합침 ("한식 | 삼계탕")
)