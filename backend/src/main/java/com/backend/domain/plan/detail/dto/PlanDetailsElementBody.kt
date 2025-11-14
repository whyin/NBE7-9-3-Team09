package com.backend.domain.plan.detail.dto

import com.backend.domain.plan.detail.entity.PlanDetail
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

@JvmRecord
data class PlanDetailsElementBody(
    val id: Long?,
    val placeId: @NotNull Long,
    val placeName: @NotEmpty String?,
    val startTime: @NotEmpty LocalDateTime?,
    val endTime: @NotEmpty LocalDateTime?,
    val title: @NotEmpty String?,
    val content: @NotEmpty String?
) {
    constructor(planDetail: PlanDetail) : this(
        planDetail.id,
        planDetail.place?.id ?:0 ,
        planDetail.place?.placeName,
        planDetail.startTime,
        planDetail.endTime,
        planDetail.title,
        planDetail.content
    )
}
