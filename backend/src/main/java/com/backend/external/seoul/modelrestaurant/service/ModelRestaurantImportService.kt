package com.backend.external.seoul.modelrestaurant.service;

import com.backend.domain.category.entity.Category;
import com.backend.domain.category.repository.CategoryRepository;
import com.backend.domain.place.entity.Place;
import com.backend.domain.place.repository.PlaceRepository;
import com.backend.external.seoul.modelrestaurant.dto.ModelRestaurantPage;
import com.backend.external.seoul.modelrestaurant.dto.ModelRestaurantRow;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ModelRestaurantImportService {

    private final Environment env;
    private final GenericModelRestaurantApiService api;
    private final PlaceRepository placeRepository;
    private final CategoryRepository categoryRepository;

    private static final String CATEGORY_NAME = "맛집";

    public List<String> districts() {
        String csv = env.getProperty("modelrestaurant.districts", "");
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();
    }

    @Transactional
    public int importAllDistricts() {
        int total = 0;
        for (String d : districts()) {
            total += importByDistrict(d);
        }
        return total;
    }

    @Transactional
    public int importByDistrict(String district) {
        Category category = getOrCreateCategory(CATEGORY_NAME);

        int start = 1, page = 100, saved = 0;
        while (true) {
            int end = start + page - 1;

            ModelRestaurantPage pageData = api.fetch(district, start, end);
            var rows = pageData.rows();
            if (rows == null || rows.isEmpty()) break;

            for (ModelRestaurantRow r : rows) {
                if (r.name().isBlank() || r.address().isBlank()) continue;
                if (placeRepository.existsByPlaceNameAndAddress(r.name(), r.address())) continue;

                Place p = Place.builder()
                        .placeName(r.name())
                        .address(r.address())
                        .gu(r.gu())
                        .category(category)
                        .description(r.description())
                        .createdDate(LocalDateTime.now())
                        .updatedDate(LocalDateTime.now())
                        .build();

                placeRepository.save(p);
                saved++;
            }

            if (rows.size() < page) break; // 마지막 페이지
            start = end + 1;
        }
        return saved;
    }

    private Category getOrCreateCategory(String name) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(name);
                    c.setCreatedDate(LocalDateTime.now());
                    c.setUpdatedDate(LocalDateTime.now());
                    return categoryRepository.save(c);
                });
    }
}