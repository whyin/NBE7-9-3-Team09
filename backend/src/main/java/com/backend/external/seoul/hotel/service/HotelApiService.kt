package com.backend.external.seoul.hotel.service;

import com.backend.external.seoul.hotel.dto.HotelRoot;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class HotelApiService {

    @Value("${seoul.api.key}")
    private String apiKey;

    @Value("${seoul.api.base-url}")
    private String baseUrl;

    private final RestClient restClient = RestClient.create();

    public HotelRoot fetchHotels(int start, int end) {
        String url = String.format(
                "%s/%s/json/SebcHotelListKor/%d/%d",
                baseUrl, apiKey, start, end
        );
        return restClient.get()
                .uri(url)
                .retrieve()
                .body(HotelRoot.class);
    }
}