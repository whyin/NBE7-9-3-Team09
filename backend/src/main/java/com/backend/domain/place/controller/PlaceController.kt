package com.backend.domain.place.controller

import com.backend.domain.place.dto.RequestPlaceDto
import com.backend.domain.place.dto.ResponsePlaceDto
import com.backend.domain.place.service.PlaceService
import com.backend.global.response.ApiResponse
import jakarta.validation.Valid
import jakarta.validation.constraints.Min
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/place")
@Validated
class PlaceController(
    private val placeService: PlaceService,
) {

    @GetMapping("/category/{categoryId}")
    fun getPlacesByCategoryId(
        @PathVariable @Min(1) categoryId: Int,
    ): ApiResponse<List<ResponsePlaceDto>?> {
        val data = placeService.findPlacesByCategoryId(categoryId)
        // success(data: T?) -> ApiResponse<T?>
        return ApiResponse.success(data)
    }

    @GetMapping("/{id}")
    fun getPlace(
        @PathVariable @Min(1) id: Long,
    ): ApiResponse<ResponsePlaceDto?> {
        val data = placeService.findOnePlace(id)
        // success(data: T?) -> ApiResponse<T?>
        return ApiResponse.success(data)
    }

    @PostMapping
    fun createPlace(
        @RequestBody @Valid dto: RequestPlaceDto,
    ): ApiResponse<Void?> {
        placeService.save(dto)
        // created(data: T) -> T 를 Void? 로 지정해서 null 허용
        return ApiResponse.created<Void?>(null)
    }

    @PutMapping("/{id}")
    fun updatePlace(
        @PathVariable @Min(1) id: Long,
        @RequestBody @Valid dto: RequestPlaceDto,
    ): ApiResponse<ResponsePlaceDto> {
        val updated = placeService.update(id, dto)
        // success(data: T, customMessage: String) -> ApiResponse<T>
        return ApiResponse.success(updated, "여행지가 성공적으로 수정되었습니다.")
    }

    @DeleteMapping("/{id}")
    fun deletePlace(
        @PathVariable @Min(1) id: Long,
    ): ApiResponse<Void?> {
        placeService.delete(id)
        // success(customMessage: String) -> ApiResponse<T?>
        return ApiResponse.success<Void?>("여행지가 삭제되었습니다.")
    }
}