package com.backend.external.seoul.nightspot.controller.controller

import com.backend.external.seoul.nightspot.service.service.NightSpotImportService
import com.backend.global.response.ApiResponse
import com.backend.global.response.ResponseCode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/internal/import/nightspots")
class NightSpotImportController(
    private val importService: NightSpotImportService,
) {

    @PostMapping
    fun importNightSpots(): ResponseEntity<ApiResponse<Void?>> {
        val saved = importService.importAll()

        val body = ApiResponse<Void?>(
            ResponseCode.CREATED.code,                 // 코드 그대로 사용
            "야간명소 ${saved}건 저장 완료",            // 커스텀 메시지
            null
        )

        return ResponseEntity
            .status(ResponseCode.CREATED.status)       // HTTP 201
            .body(body)
    }
}