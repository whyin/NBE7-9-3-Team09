package com.backend.domain.plan.detail.dto

import com.backend.domain.plan.detail.entity.PlanDetail
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

@JvmRecord
data class PlanDetailResponseBody(
    val placeId: @NotNull Long,
    val startTime: @NotEmpty LocalDateTime?,
    val endTime: @NotEmpty LocalDateTime?,
    val title: @NotEmpty String?,
    val content: @NotEmpty String?
) {
    constructor(planDetail: PlanDetail) : this(
        planDetail.place?.id?:0,
        planDetail.startTime,
        planDetail.endTime,
        planDetail.title,
        planDetail.content
    )
}
