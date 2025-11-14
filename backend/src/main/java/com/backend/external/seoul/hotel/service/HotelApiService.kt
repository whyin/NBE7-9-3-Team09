package com.backend.external.seoul.hotel.service

import com.backend.external.seoul.hotel.dto.HotelRoot
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient

@Service
class HotelApiService(

    @Value("\${seoul.api.key}")
    private val apiKey: String,

    @Value("\${seoul.api.base-url}")
    private val baseUrl: String,
) {
    private val restClient: RestClient = RestClient.create()

    fun fetchHotels(start: Int, end: Int): HotelRoot? {
        val url = String.format(
            "%s/%s/json/SebcHotelListKor/%d/%d",
            baseUrl, apiKey, start, end
        )

        return restClient.get()
            .uri(url)
            .retrieve()
            .body(HotelRoot::class.java)
    }
}