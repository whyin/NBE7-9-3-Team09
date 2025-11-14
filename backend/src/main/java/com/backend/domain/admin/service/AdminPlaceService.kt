package com.backend.domain.admin.service

import com.backend.domain.admin.dto.response.MemberAdminResponse
import com.backend.domain.category.repository.CategoryRepository
import com.backend.domain.place.dto.RequestPlaceDto
import com.backend.domain.place.dto.ResponsePlaceDto
import com.backend.domain.place.entity.Place
import com.backend.domain.place.repository.PlaceRepository
import com.backend.domain.place.service.PlaceService
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class AdminPlaceService(
    private val placeRepository: PlaceRepository,
    private val categoryRepository: CategoryRepository,
    private val placeService: PlaceService
) {

    /** 전체 장소 조회 */
    fun getAllPlaces(): List<ResponsePlaceDto> =
        placeRepository.findAll()
            .map(ResponsePlaceDto::from)

    /** 특정 카테고리에 속한 장소 조회 */
    fun getPlacesByCategory(categoryId: Int): List<ResponsePlaceDto> =
        placeService.findPlacesByCategoryId(categoryId)

    /** 장소 단건 조회 */
    fun getPlace(id: Long): ResponsePlaceDto =
        placeService.findOnePlace(id)

    /** 장소 등록 (관리자 직접 등록) */
    fun createPlace(dto: RequestPlaceDto) {
        val category = categoryRepository.findById(dto.categoryId)
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_CATEGORY) }

        val place = Place(
            placeName = dto.placeName,
            address = dto.address,
            gu = dto.gu,
            category = category,
            description = dto.description
        )

        placeRepository.save(place)
    }

    /** 장소 수정 */
    fun updatePlace(id: Long, dto: RequestPlaceDto): ResponsePlaceDto =
        placeService.update(id, dto)

    /** 장소 삭제 */
    fun deletePlace(id: Long) {
        val place = placeRepository.findById(id)
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_PLACE) }

        placeRepository.delete(place)
    }
}

