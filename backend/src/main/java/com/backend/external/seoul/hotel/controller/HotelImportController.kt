package com.backend.external.seoul.hotel.controller

import com.backend.external.seoul.hotel.service.HotelImportService
import com.backend.global.response.ApiResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/internal/import/hotels")
class HotelImportController(
    private val hotelImportService: HotelImportService,
) {

    @PostMapping
    fun importHotels(): ResponseEntity<ApiResponse<String?>> {
        val count = hotelImportService.importAll()
        return ResponseEntity.ok(
            ApiResponse.success<String?>("호텔 ${count}개 저장 완료")
        )
    }
}