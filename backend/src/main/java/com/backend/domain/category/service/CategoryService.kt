package com.backend.domain.category.service

import com.backend.domain.category.dto.ResponseCategoryDto
import com.backend.domain.category.repository.CategoryRepository
import org.springframework.stereotype.Service

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
) {

    fun findAll(): List<ResponseCategoryDto> =
        categoryRepository.findAll()
            .map(ResponseCategoryDto::from)
}