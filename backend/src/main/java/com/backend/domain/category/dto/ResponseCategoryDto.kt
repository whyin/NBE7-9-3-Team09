package com.backend.domain.category.dto;

import com.backend.domain.category.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResponseCategoryDto {
    private Long id;
    private String name;

    public static ResponseCategoryDto from(Category category) {
        return new ResponseCategoryDto(
                category.getId(),
                category.getName()
        );
    }
}