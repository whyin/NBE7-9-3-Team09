package com.backend.domain.place.service

import com.backend.domain.bookmark.dto.BookmarkResponseDto
import com.backend.domain.category.repository.CategoryRepository
import com.backend.domain.place.dto.RequestPlaceDto
import com.backend.domain.place.dto.ResponsePlaceDto
import com.backend.domain.place.entity.Place
import com.backend.domain.place.repository.PlaceRepository
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PlaceService(
    private val placeRepository: PlaceRepository,
    private val categoryRepository: CategoryRepository,
) {

    fun findPlaceById(id: Long): Place =
        placeRepository.findById(id)
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_PLACE) }

    fun findPlacesByCategoryId(categoryId: Int): List<ResponsePlaceDto> =
        placeRepository.findByCategoryId(categoryId)
            .map(ResponsePlaceDto::from)

    fun findOnePlace(id: Long): ResponsePlaceDto =
        ResponsePlaceDto.from(findPlaceById(id))

    @Transactional
    fun save(dto: RequestPlaceDto) {
        val category = categoryRepository.findById(dto.categoryId)
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_CATEGORY) }

        val place = dto.toEntity(category)
        placeRepository.save(place)
    }

    @Transactional
    fun update(id: Long, dto: RequestPlaceDto): ResponsePlaceDto {
        val place = findPlaceById(id)

        place.update(
            dto.placeName,
            dto.address,
            dto.gu,
            dto.description
        )

        return ResponsePlaceDto.from(place)
    }

    @Transactional
    fun delete(id: Long) {
        placeRepository.delete(findPlaceById(id))
    }

    // 페이징 가져오기
    fun getPagedPlaces(categoryId: Long, keyword: String?, pageable: Pageable): Page<ResponsePlaceDto> {
        return placeRepository.findPagedByCategoryId(categoryId, keyword, pageable)
            .map (ResponsePlaceDto::from)
    }
}