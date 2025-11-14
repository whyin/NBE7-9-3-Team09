package com.backend.domain.category.repository

import com.backend.domain.category.entity.Category
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface CategoryRepository : JpaRepository<Category, Long> {
    fun findByName(name: String): Optional<Category>
}