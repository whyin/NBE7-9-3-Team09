package com.backend.domain.category.service;

import com.backend.domain.category.dto.ResponseCategoryDto;
import com.backend.domain.category.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<ResponseCategoryDto> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(ResponseCategoryDto::from)
                .toList();
    }
}
