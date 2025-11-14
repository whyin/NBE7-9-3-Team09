package com.backend.domain.place.dto;

import com.backend.domain.place.entity.Place;

public record ResponsePlaceDto(
        Long id,
        String placeName,
        String address,
        String gu,
        String category,
        String description
) {
    public static ResponsePlaceDto from(Place place) {
        return new ResponsePlaceDto(
                place.getId(),
                place.getPlaceName(),
                place.getAddress(),
                place.getGu(),
                place.getCategory().getName(),
                place.getDescription()
        );
    }
}