package com.backend.global.config;


import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public Caffeine<Object, Object> caffeineConfig() {
        return Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES) // 5분 동안 사용 안 하면 캐시 삭제
                .maximumSize(1000);                    // 최대 1000개까지만
    }

    @Bean
    public CacheManager cacheManager(Caffeine<Object, Object> caffeine) {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                "recommendTop5",   // 카테고리별 TOP5 추천
                "sortedPlaces"    // 카테고리별 전체 정렬
        );
        cacheManager.setCaffeine(caffeine);
        return cacheManager;
    }
}
