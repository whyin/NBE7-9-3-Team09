package com.backend.external.seoul.modelrestaurant.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ModelRestaurantRoot {

    @JsonProperty("YdpModelRestaurantDesignate")
    public Container ydp;

    @JsonProperty("YcModelRestaurantDesignate")
    public Container yc;

    @JsonProperty("DongdeamoonModelRestaurantDesignate")
    public Container ddm;

    @JsonProperty("DjModelRestaurantDesignate")
    public Container dj;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Container {
        public List<Row> row;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Row {
        public String UPSO_NM;
        public String SITE_ADDR_RD;
        public String SITE_ADDR;
        public String SNT_UPTAE_NM;
        public String MAIN_EDF;
    }

    public Container getContainer() {
        if (ydp != null) return ydp;
        if (yc  != null) return yc;
        if (ddm != null) return ddm;
        if (dj  != null) return dj;
        return null;
    }
}