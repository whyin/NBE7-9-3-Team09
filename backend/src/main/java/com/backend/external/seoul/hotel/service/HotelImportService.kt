package com.backend.external.seoul.hotel.service

import com.backend.domain.category.entity.Category
import com.backend.domain.category.repository.CategoryRepository
import com.backend.domain.place.entity.Place
import com.backend.domain.place.repository.PlaceRepository
import com.backend.external.seoul.hotel.dto.HotelRow
import com.backend.external.seoul.hotel.dto.HotelRoot
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class HotelImportService(
    private val hotelApiService: HotelApiService,
    private val placeRepository: PlaceRepository,
    private val categoryRepository: CategoryRepository,
) {

    companion object {
        private const val CATEGORY_HOTEL = "HOTEL"
        private const val PAGE_SIZE = 100
    }

    @Transactional
    fun importAll(): Int {
        var start = 1
        var end = PAGE_SIZE
        var saved = 0

        // 카테고리 확보 (없으면 생성)
        val hotel = getOrCreateCategory(CATEGORY_HOTEL)

        while (true) {
            val root: HotelRoot = hotelApiService.fetchHotels(start, end) ?: break
            val list = root.SebcHotelListKor() ?: break
            val rows: List<HotelRow> = list.row() ?: break
            if (rows.isEmpty()) break

            for (row in rows) {
                val name = safe(row.NAME_KOR())
                val city = safe(row.H_KOR_CITY()) // 서울특별시
                val gu = safe(row.H_KOR_GU())     // 서초구
                val dong = safe(row.H_KOR_DONG()) // 반포4동

                val address = buildAddress(city, gu, dong)

                // 최소 데이터 검증
                if (name.isBlank() || address.isBlank()) continue

                // 중복 방지
                if (placeRepository.existsByPlaceNameAndAddress(name, address)) continue

                val now = LocalDateTime.now()

                val place = Place(
                    placeName = name,
                    address = address,
                    gu = gu,
                    category = hotel,
                    description = "호텔",
                ).apply {
                    createdDate = now
                    updatedDate = now
                }

                placeRepository.save(place)
                saved++
            }

            // 마지막 페이지이면 종료
            if (rows.size < PAGE_SIZE) break

            // 다음 페이지로
            start = end + 1
            end = start + PAGE_SIZE - 1
        }

        return saved
    }

    private fun getOrCreateCategory(name: String): Category =
        categoryRepository.findByName(name)
            .orElseGet {
                val now = LocalDateTime.now()
                Category(
                    name = name,
                    createdDate = now,
                    updatedDate = now
                ).let(categoryRepository::save)
            }

    private fun buildAddress(city: String, gu: String, dong: String): String =
        listOf(city, gu, dong)
            .filter { it.isNotBlank() }
            .joinToString(" ")

    private fun safe(s: String?): String = s?.trim() ?: ""
}