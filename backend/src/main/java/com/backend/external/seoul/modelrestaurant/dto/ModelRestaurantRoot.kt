package com.backend.external.seoul.modelrestaurant.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class ModelRestaurantRoot(

    @JsonProperty("YdpModelRestaurantDesignate")
    val ydp: Container? = null,

    @JsonProperty("YcModelRestaurantDesignate")
    val yc: Container? = null,

    @JsonProperty("DongdeamoonModelRestaurantDesignate")
    val ddm: Container? = null,

    @JsonProperty("DjModelRestaurantDesignate")
    val dj: Container? = null,
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class Container(
        val row: List<Row>? = emptyList()
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class Row(
        @JsonProperty("UPSO_NM")
        val upsoNm: String? = null,

        @JsonProperty("SITE_ADDR_RD")
        val siteAddrRd: String? = null,

        @JsonProperty("SITE_ADDR")
        val siteAddr: String? = null,

        @JsonProperty("SNT_UPTAE_NM")
        val uptae: String? = null,

        @JsonProperty("MAIN_EDF")
        val mainEdf: String? = null,
    )

    fun getContainer(): Container? =
        ydp ?: yc ?: ddm ?: dj
}