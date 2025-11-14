package com.backend.external.seoul.hotel.dto;

import java.util.List;

public record HotelResponse(
        Integer list_total_count,
        List<HotelRow> row
) {}