package com.backend.domain.category.controller

import com.backend.domain.category.dto.ResponseCategoryDto
import com.backend.domain.category.service.CategoryService
import com.backend.global.response.ApiResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/categories")
class CategoryController(
    private val categoryService: CategoryService,
) {

    @GetMapping
    fun getAllCategories(): ApiResponse<List<ResponseCategoryDto>> {
        val data = categoryService.findAll()
        return ApiResponse.success(data)
    }
}