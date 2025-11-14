package com.backend.domain.place.dto

import com.backend.domain.category.entity.Category
import com.backend.domain.place.entity.Place
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Positive
import jakarta.validation.constraints.Size

data class RequestPlaceDto(

    @field:NotBlank(message = "장소 이름은 필수입니다.")
    @field:Size(max = 50, message = "장소 이름은 최대 50자까지 가능합니다.")
    val placeName: String,

    @field:NotBlank(message = "주소는 필수입니다.")
    val address: String,

    @field:NotBlank(message = "구 정보는 필수입니다.")
    val gu: String,

    @field:NotNull(message = "카테고리 ID는 필수입니다.")
    @field:Positive(message = "카테고리 ID는 양수여야 합니다.")
    val categoryId: Long,

    @field:Size(max = 255, message = "설명은 최대 255자까지 가능합니다.")
    val description: String? = null,
) {

    fun toEntity(category: Category): Place =
        Place(
            placeName = placeName,
            address = address,
            gu = gu,
            category = category,
            description = description,
        )
}