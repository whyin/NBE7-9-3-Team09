// NightSpotImportService.java
package com.backend.external.seoul.nightspot.service.service;

import com.backend.domain.category.entity.Category;
import com.backend.domain.category.repository.CategoryRepository;
import com.backend.domain.place.entity.Place;
import com.backend.domain.place.repository.PlaceRepository;
import com.backend.external.seoul.nightspot.dto.dto.NightSpotResponse;
import com.backend.external.seoul.nightspot.dto.dto.NightSpotRoot;
import com.backend.external.seoul.nightspot.dto.dto.NightSpotRow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NightSpotImportService {

    private final NightSpotApiService apiService;
    private final PlaceRepository placeRepository;
    private final CategoryRepository categoryRepository;

    private static final String NIGHTSPOT = "NIGHTSPOT";

    @Transactional
    public int importAll() {
        // 총 개수 읽는 DTO가 없으니 일단 넉넉히 1~1000 요청 (51건이면 전부 포함)
        NightSpotRoot root = apiService.fetchNightSpots(1, 1000);
        NightSpotResponse resp = root.viewNightSpot();
        if (resp == null || resp.row() == null) return 0;

        Category nightspot = getOrCreateCategory(NIGHTSPOT);

        int saved = 0;
        for (NightSpotRow r : resp.row()) {
            String name = safe(r.TITLE());
            String addr = safe(r.ADDR());

            if (name.isBlank() || addr.isBlank()) continue;               // 최소 데이터 검증
            if (placeRepository.existsByPlaceNameAndAddress(name, addr))   // 중복 방지
                continue;

            Place p = Place.builder()
                    .placeName(name)
                    .address(addr)
                    .gu(extractGu(addr))                       // "서울특별시 XX구 ..." 에서 구 추출
                    .category(nightspot)
                    .description(buildDescription(r))          // 운영시간/요금/URL 등 합침
                    .createdDate(LocalDateTime.now())
                    .updatedDate(LocalDateTime.now())
                    .build();

            placeRepository.save(p);
            saved++;
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

    private String extractGu(String address) {
        // 예) "서울특별시 용산구 남산공원길 105" -> "용산구"
        if (address == null) return null;
        int s = address.indexOf(' ');
        if (s == -1) return null;
        String[] parts = address.split("\\s+");
        for (String part : parts) {
            if (part.endsWith("구")) return part;
        }
        return null;
    }

    private String buildDescription(NightSpotRow r) {
        StringBuilder sb = new StringBuilder();
        if (r.OPERATING_TIME() != null && !r.OPERATING_TIME().isBlank())
            sb.append("운영시간: ").append(r.OPERATING_TIME()).append("\n");
        if (r.FREE_YN() != null && !r.FREE_YN().isBlank())
            sb.append("요금: ").append(r.FREE_YN()).append("\n");
        if (r.ENTR_FEE() != null && !r.ENTR_FEE().isBlank())
            sb.append("입장료: ").append(r.ENTR_FEE()).append("\n");
        if (r.URL() != null && !r.URL().isBlank())
            sb.append("URL: ").append(r.URL());
        return sb.toString().trim();
    }

    private String safe(String v) {
        return v == null ? "" : v.trim();
    }
}