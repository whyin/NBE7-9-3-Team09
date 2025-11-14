package com.backend.domain.place.dto;

import com.backend.domain.category.entity.Category;
import com.backend.domain.place.entity.Place;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Positive;

public record RequestPlaceDto(

        @NotBlank(message = "장소 이름은 필수입니다.")
        @Size(max = 50, message = "장소 이름은 최대 50자까지 가능합니다.")
        String placeName,

        @NotBlank(message = "주소는 필수입니다.")
        String address,

        @NotBlank(message = "구 정보는 필수입니다.")
        String gu,

        @NotNull(message = "카테고리 ID는 필수입니다.")
        @Positive(message = "카테고리 ID는 양수여야 합니다.")
        Long categoryId,

        @Size(max = 255, message = "설명은 최대 255자까지 가능합니다.")
        String description
) {

    public Place toEntity(Category category) {
        return Place.builder()
                .placeName(placeName)
                .address(address)
                .gu(gu)
                .category(category)
                .description(description)
                .build();
    }

}