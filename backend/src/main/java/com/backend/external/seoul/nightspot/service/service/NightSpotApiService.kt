package com.backend.external.seoul.nightspot.service.service

import com.backend.external.seoul.nightspot.dto.dto.NightSpotRoot
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient

@Service
class NightSpotApiService(

    // yml 값 주입
    @Value("\${seoul.api.key}")
    private val apiKey: String,

    @Value("\${seoul.api.base-url}")
    private val baseUrl: String,
) {

    private val restClient: RestClient = RestClient.create()

    /**
     * 서울공공데이터 야간명소 API 요청
     * @param start 시작 번호
     * @param end   끝 번호
     * @return NightSpotRoot (nullable 가능)
     */
    fun fetchNightSpots(start: Int, end: Int): NightSpotRoot? {
        val url = "$baseUrl/$apiKey/json/viewNightSpot/$start/$end"

        return restClient.get()
            .uri(url)
            .retrieve()
            .body(NightSpotRoot::class.java)
    }
}