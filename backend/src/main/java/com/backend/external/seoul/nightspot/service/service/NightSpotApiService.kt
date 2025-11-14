package com.backend.external.seoul.nightspot.service.service;

import com.backend.external.seoul.nightspot.dto.dto.NightSpotRoot;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class NightSpotApiService {

    // yml에서 읽어오기
    @Value("${seoul.api.key}")
    private String apiKey;

    @Value("${seoul.api.base-url}")
    private String baseUrl;

    private final RestClient restClient = RestClient.create();

    /**
     * 서울공공데이터 야간명소 API 요청
     * @param start  시작 번호
     * @param end    끝 번호
     * @return       DTO (NightSpotRoot)
     */
    public NightSpotRoot fetchNightSpots(int start, int end) {
        String url = String.format(
                "%s/%s/json/viewNightSpot/%d/%d",
                baseUrl, apiKey, start, end
        );

        return restClient.get()
                .uri(url)
                .retrieve()
                .body(NightSpotRoot.class);
    }
}
