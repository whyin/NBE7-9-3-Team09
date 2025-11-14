package com.backend.external.seoul.modelrestaurant.dto;
import java.util.List;
// 구별 루트에서 공통 Row 리스트만 뽑아주기 위한 래퍼
public record ModelRestaurantPage(List<ModelRestaurantRow> rows) {}