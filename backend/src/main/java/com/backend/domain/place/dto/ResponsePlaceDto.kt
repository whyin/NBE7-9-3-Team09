package com.backend.domain.place.dto

import com.backend.domain.place.entity.Place

data class ResponsePlaceDto(
    val id: Long?,
    val placeName: String,
    val address: String?,
    val gu: String?,
    val category: String,
    val description: String?
) {
    companion object {
        fun from(place: Place): ResponsePlaceDto =
            ResponsePlaceDto(
                id = place.id,
                placeName = place.placeName,
                address = place.address,
                gu = place.gu,
                category = place.category.name,
                description = place.description
            )
    }
}