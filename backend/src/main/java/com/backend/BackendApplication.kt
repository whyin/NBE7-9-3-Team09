package com.backend

import com.backend.global.config.KakaoProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
import org.springframework.scheduling.annotation.EnableScheduling
@EnableCaching
@EnableScheduling
@SpringBootApplication
@EnableConfigurationProperties(KakaoProperties::class)
class BackendApplication

fun main(args: Array<String>){
    runApplication<BackendApplication>(*args)
}