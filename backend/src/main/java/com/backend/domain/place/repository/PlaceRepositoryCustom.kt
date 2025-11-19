package com.backend.domain.place.repository

import com.backend.domain.place.entity.Place
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface PlaceRepositoryCustom {
    fun findPagedByCategoryId(categoryId: Long, keyword:String?, pageable: Pageable): Page<Place>
}