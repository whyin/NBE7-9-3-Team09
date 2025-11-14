package com.backend.external.seoul.modelrestaurant.service

import com.backend.external.seoul.modelrestaurant.dto.ModelRestaurantPage
import com.backend.external.seoul.modelrestaurant.dto.ModelRestaurantRow
import com.backend.external.seoul.modelrestaurant.dto.ModelRestaurantRoot
import org.springframework.core.env.Environment
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient

@Service
class GenericModelRestaurantApiService(
    private val env: Environment,
) {

    private val http: RestClient = RestClient.create()

    fun fetch(district: String, start: Int, end: Int): ModelRestaurantPage {
        val prefix = "$district.api."
        val baseUrl = env.getProperty("${prefix}base-url")
        val apiKey = env.getProperty("${prefix}key")
        val endpoint = env.getProperty("${prefix}endpoint")

        if (baseUrl.isNullOrBlank() || apiKey.isNullOrBlank() || endpoint.isNullOrBlank()) {
            return ModelRestaurantPage(emptyList())
        }

        val url = "$baseUrl/$apiKey/json/$endpoint/$start/$end"

        val root = http.get()
            .uri(url)
            .retrieve()
            .body(ModelRestaurantRoot::class.java)

        val container = root?.getContainer()
        val rows = container?.row ?: return ModelRestaurantPage(emptyList())

        val out = mutableListOf<ModelRestaurantRow>()

        for (r in rows) {
            val name = nz(r.upsoNm)
            val addrFromRd = nz(r.siteAddrRd)
            val addr = if (addrFromRd.isNotBlank()) addrFromRd else nz(r.siteAddr)

            if (name.isBlank() || addr.isBlank()) continue

            val gu = extractGu(addr)
            val desc = buildDesc(r.uptae, r.mainEdf)

            out.add(
                ModelRestaurantRow(
                    name = name,
                    address = addr,
                    gu = gu ?: "",          // Kotlin 쪽에서 non-null String으로 맞추기
                    category = "맛집",
                    description = desc
                )
            )
        }

        return ModelRestaurantPage(out)
    }

    private fun nz(s: String?): String = s?.trim() ?: ""

    private fun extractGu(address: String?): String? {
        if (address.isNullOrBlank()) return null
        return address.split("\\s+".toRegex())
            .firstOrNull { it.endsWith("구") }
    }

    private fun buildDesc(uptae: String?, main: String?): String {
        val u = nz(uptae)
        val m = nz(main)
        return when {
            u.isNotBlank() && m.isNotBlank() -> "$u | $m"
            u.isNotBlank() -> u
            m.isNotBlank() -> m
            else -> ""
        }
    }
}