package com.backend.external.seoul.modelrestaurant.dto;

// 각 구 API에서 row 배열만 꺼내 공통 Row로 변환해서 넘깁니다.
public record ModelRestaurantRow(
        String name,        // 업소명 (UPSO_NM)
        String address,     // 주소 (SITE_ADDR_RD 있으면 우선, 없으면 SITE_ADDR)
        String gu,          // 주소에서 "XX구" 추출
        String category,    // "맛집" 고정
        String description  // 업태 + 주된음식 합침 ("한식 | 삼계탕")
) {}

