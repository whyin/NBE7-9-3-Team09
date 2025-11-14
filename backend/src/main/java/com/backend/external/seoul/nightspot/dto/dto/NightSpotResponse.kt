package com.backend.external.seoul.nightspot.dto.dto;

import java.util.List;

// 2️⃣ viewNightSpot 내부
public record NightSpotResponse(
        List<NightSpotRow> row
) {}
