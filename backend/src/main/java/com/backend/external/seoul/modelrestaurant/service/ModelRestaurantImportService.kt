package com.backend.external.seoul.modelrestaurant.service

import com.backend.domain.category.entity.Category
import com.backend.domain.category.repository.CategoryRepository
import com.backend.domain.place.entity.Place
import com.backend.domain.place.repository.PlaceRepository
import com.backend.external.seoul.modelrestaurant.dto.ModelRestaurantPage
import com.backend.external.seoul.modelrestaurant.dto.ModelRestaurantRow
import org.springframework.core.env.Environment
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ModelRestaurantImportService(
    private val env: Environment,
    private val api: GenericModelRestaurantApiService,
    private val placeRepository: PlaceRepository,
    private val categoryRepository: CategoryRepository,
) {

    companion object {
        private const val CATEGORY_NAME = "맛집"
    }

    fun districts(): List<String> {
        val csv = env.getProperty("modelrestaurant.districts", "") ?: ""
        return csv.split(",")
            .map { it.trim() }
            .filter { it.isNotBlank() }
    }

    @Transactional
    fun importAllDistricts(): Int {
        var total = 0
        for (d in districts()) {
            total += importByDistrict(d)
        }
        return total
    }

    @Transactional
    fun importByDistrict(district: String): Int {
        val category = getOrCreateCategory(CATEGORY_NAME)

        var start = 1
        val pageSize = 100
        var saved = 0

        while (true) {
            val end = start + pageSize - 1

            val pageData: ModelRestaurantPage = api.fetch(district, start, end)
            val rows: List<ModelRestaurantRow> = pageData.rows ?: break
            if (rows.isEmpty()) break

            for (r in rows) {
                val name = r.name
                val address = r.address

                if (name.isBlank() || address.isBlank()) continue
                if (placeRepository.existsByPlaceNameAndAddress(name, address)) continue

                val now = LocalDateTime.now()

                val place = Place(
                    placeName = name,
                    address = address,
                    gu = r.gu,
                    category = category,
                    description = r.description,
                ).apply {
                    createdDate = now
                    updatedDate = now
                }

                placeRepository.save(place)
                saved++
            }

            if (rows.size < pageSize) break  // 마지막 페이지
            start = end + 1
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
}