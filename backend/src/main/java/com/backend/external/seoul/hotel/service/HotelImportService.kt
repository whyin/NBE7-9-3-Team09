package com.backend.external.seoul.hotel.service;

import com.backend.domain.category.entity.Category;
import com.backend.domain.category.repository.CategoryRepository;
import com.backend.domain.place.entity.Place;
import com.backend.domain.place.repository.PlaceRepository;
import com.backend.external.seoul.hotel.dto.HotelRow;
import com.backend.external.seoul.hotel.dto.HotelRoot;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelImportService {

    private static final String CATEGORY_HOTEL = "HOTEL";
    private static final int PAGE_SIZE = 100;

    private final HotelApiService hotelApiService;
    private final PlaceRepository placeRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public int importAll() {
        int start = 1;
        int end = PAGE_SIZE;
        int saved = 0;

        // 카테고리 확보 (없으면 생성)
        Category hotel = getOrCreateCategory(CATEGORY_HOTEL);

        while (true) {
            HotelRoot root = hotelApiService.fetchHotels(start, end);
            if (root == null || root.SebcHotelListKor() == null) break;

            List<HotelRow> rows = root.SebcHotelListKor().row();
            if (rows == null || rows.isEmpty()) break;

            for (HotelRow row : rows) {
                String name = safe(row.NAME_KOR());
                String city = safe(row.H_KOR_CITY()); // 서울특별시
                String gu   = safe(row.H_KOR_GU());   // 서초구
                String dong = safe(row.H_KOR_DONG()); // 반포4동

                // 주소(시/구/동) 합치기
                String address = buildAddress(city, gu, dong);

                // 최소 데이터 검증
                if (name.isBlank() || address.isBlank()) continue;

                // 중복 방지
                if (placeRepository.existsByPlaceNameAndAddress(name, address)) continue;

                Place place = Place.builder()
                        .placeName(name)
                        .address(address)
                        .gu(gu)
                        .description("호텔")
                        .category(hotel)
                        .createdDate(LocalDateTime.now())
                        .updatedDate(LocalDateTime.now())
                        .build();

                placeRepository.save(place);
                saved++;
            }

            // 마지막 페이지이면 종료
            if (rows.size() < PAGE_SIZE) break;

            // 다음 페이지로
            start = end + 1;
            end = start + PAGE_SIZE - 1;
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

    private String buildAddress(String city, String gu, String dong) {
        String addr = String.join(" ", city, gu, dong).trim();
        // 중간에 빈 값이 섞여도 공백 정리
        return addr.replaceAll("\\s+", " ");
    }

    private String safe(String s) {
        return s == null ? "" : s.trim();
    }
}