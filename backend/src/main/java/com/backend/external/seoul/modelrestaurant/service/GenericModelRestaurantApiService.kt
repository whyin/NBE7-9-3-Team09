package com.backend.external.seoul.modelrestaurant.service;

import com.backend.external.seoul.modelrestaurant.dto.ModelRestaurantPage;
import com.backend.external.seoul.modelrestaurant.dto.ModelRestaurantRow;
import com.backend.external.seoul.modelrestaurant.dto.ModelRestaurantRoot;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GenericModelRestaurantApiService {

    private final Environment env;
    private final RestClient http = RestClient.create();

    public ModelRestaurantPage fetch(String district, int start, int end) {
        String prefix   = district + ".api.";
        String baseUrl  = env.getProperty(prefix + "base-url");
        String apiKey   = env.getProperty(prefix + "key");
        String endpoint = env.getProperty(prefix + "endpoint");

        if (baseUrl == null || apiKey == null || endpoint == null) {
            return new ModelRestaurantPage(List.of());
        }

        String url = String.format("%s/%s/json/%s/%d/%d", baseUrl, apiKey, endpoint, start, end);
        // System.out.println("[ModelRestaurant] GET " + url);

        ModelRestaurantRoot root = http.get()
                .uri(url)
                .retrieve()
                .body(ModelRestaurantRoot.class);

        ModelRestaurantRoot.Container container =
                (root == null) ? null : root.getContainer();

        List<ModelRestaurantRow> out = new ArrayList<>();
        if (container == null || container.row == null) {
            return new ModelRestaurantPage(out);
        }

        for (ModelRestaurantRoot.Row r : container.row) {
            String name = nz(r.UPSO_NM);
            String addr = !nz(r.SITE_ADDR_RD).isBlank() ? r.SITE_ADDR_RD : nz(r.SITE_ADDR);
            if (name.isBlank() || addr.isBlank()) continue;

            String gu   = extractGu(addr);
            String desc = buildDesc(r.SNT_UPTAE_NM, r.MAIN_EDF);
            out.add(new ModelRestaurantRow(name, addr, gu, "맛집", desc));
        }
        return new ModelRestaurantPage(out);
    }

    private static String nz(String s){ return s==null? "": s.trim(); }

    private static String extractGu(String address) {
        for (String p : address.split("\\s+")) if (p.endsWith("구")) return p;
        return null;
    }

    private static String buildDesc(String uptae, String main) {
        String u = nz(uptae), m = nz(main);
        if (!u.isBlank() && !m.isBlank()) return u + " | " + m;
        if (!u.isBlank()) return u;
        if (!m.isBlank()) return m;
        return "";
    }
}