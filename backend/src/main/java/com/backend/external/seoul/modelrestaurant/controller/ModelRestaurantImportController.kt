package com.backend.external.seoul.modelrestaurant.controller

import com.backend.external.seoul.modelrestaurant.service.ModelRestaurantImportService
import com.backend.global.response.ApiResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/internal/import/model-restaurants")
class ModelRestaurantImportController(
    private val importService: ModelRestaurantImportService,
) {

    // 모든 등록된 구 한 번에
    @PostMapping
    fun importAll(): ResponseEntity<ApiResponse<String?>> {
        val saved = importService.importAllDistricts()
        return ResponseEntity.ok(
            ApiResponse.success<String?>("모든 구 모범음식점 ${saved}건 저장")
        )
    }

    // 특정 구만 (예: /internal/import/model-restaurants/ydp)
    @PostMapping("/{district}")
    fun importOne(
        @PathVariable district: String,
    ): ResponseEntity<ApiResponse<String?>> {
        val saved = importService.importByDistrict(district)
        return ResponseEntity.ok(
            ApiResponse.success<String?>("${district} 모범음식점 ${saved}건 저장")
        )
    }
}