package com.backend.external.seoul.nightspot.service.service

import com.backend.domain.category.entity.Category
import com.backend.domain.category.repository.CategoryRepository
import com.backend.domain.place.entity.Place
import com.backend.domain.place.repository.PlaceRepository
import com.backend.external.seoul.nightspot.dto.dto.NightSpotResponse
import com.backend.external.seoul.nightspot.dto.dto.NightSpotRoot
import com.backend.external.seoul.nightspot.dto.dto.NightSpotRow
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class NightSpotImportService(
    private val apiService: NightSpotApiService,
    private val placeRepository: PlaceRepository,
    private val categoryRepository: CategoryRepository,
) {

    companion object {
        private const val NIGHTSPOT = "NIGHTSPOT"
    }

    @Transactional
    fun importAll(): Int {
        // 총 개수 읽는 DTO가 없으니 일단 넉넉히 1~1000 요청 (51건이면 전부 포함)
        val root: NightSpotRoot = apiService.fetchNightSpots(1, 1000) ?: return 0
        val resp: NightSpotResponse = root.viewNightSpot() ?: return 0
        val rows: List<NightSpotRow> = resp.row() ?: return 0

        val nightspot: Category = getOrCreateCategory(NIGHTSPOT)

        var saved = 0
        for (r in rows) {
            val name = safe(r.TITLE())
            val addr = safe(r.ADDR())

            // 최소 데이터 검증
            if (name.isBlank() || addr.isBlank()) continue

            // 중복 방지
            if (placeRepository.existsByPlaceNameAndAddress(name, addr)) continue

            val now = LocalDateTime.now()

            val place = Place(
                placeName = name,
                address = addr,
                gu = extractGu(addr),
                category = nightspot,
                description = buildDescription(r),
            ).apply {
                createdDate = now
                updatedDate = now
            }

            placeRepository.save(place)
            saved++
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

    private fun extractGu(address: String?): String? {
        // 예) "서울특별시 용산구 남산공원길 105" -> "용산구"
        if (address.isNullOrBlank()) return null
        val parts = address.split("\\s+".toRegex())
        return parts.firstOrNull { it.endsWith("구") }
    }

    private fun buildDescription(r: NightSpotRow): String {
        val sb = StringBuilder()

        r.OPERATING_TIME()?.takeIf { it.isNotBlank() }?.let {
            sb.append("운영시간: ").append(it).append('\n')
        }
        r.FREE_YN()?.takeIf { it.isNotBlank() }?.let {
            sb.append("요금: ").append(it).append('\n')
        }
        r.ENTR_FEE()?.takeIf { it.isNotBlank() }?.let {
            sb.append("입장료: ").append(it).append('\n')
        }
        r.URL()?.takeIf { it.isNotBlank() }?.let {
            sb.append("URL: ").append(it)
        }

        return sb.toString().trim()
    }

    private fun safe(v: String?): String = v?.trim() ?: ""
}