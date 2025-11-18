package com.backend.domain.plan.detail.dto

import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime


data class PlanDetailRequestBody(
    val planId: @NotNull(message = "계획이 누락되었습니다.") Long,
    val placeId: @NotNull(message = "장소가 누락되었습니다.") Long,
    val startTime: @NotNull LocalDateTime,
    val endTime: @NotNull LocalDateTime,
    val title: @NotEmpty String?,
    val content: @NotEmpty String?
)
