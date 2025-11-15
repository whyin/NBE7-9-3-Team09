package com.backend.domain.category.dto

import com.backend.domain.category.entity.Category

data class ResponseCategoryDto(
    val id: Long,
    val name: String,
) {
    companion object {
        fun from(category: Category): ResponseCategoryDto =
            ResponseCategoryDto(
                id = category.id ?: 0L,   // Kotlin null-safe
                name = category.name
            )
    }
}