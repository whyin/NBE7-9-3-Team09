package com.backend.external.seoul.nightspot.dto.dto;

// 1️⃣ 개별 row
public record NightSpotRow(
        String TITLE,
        String ADDR,
        String LA,
        String LO,
        String URL,
        String SUBJECT_CD,
        String OPERATING_TIME,
        String FREE_YN,
        String ENTR_FEE
) {}