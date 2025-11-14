package com.backend.external.seoul.hotel.dto;

public record HotelRow(
        String NAME_KOR,      // 호텔 이름
        String H_KOR_CITY,    // 시
        String H_KOR_GU,      // 구
        String H_KOR_DONG,    // 동
        String CATE3_NAME     // 상세 카테고리 (특1급호텔 등)
) {}