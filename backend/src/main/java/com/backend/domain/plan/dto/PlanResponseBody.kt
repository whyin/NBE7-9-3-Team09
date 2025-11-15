package com.backend.domain.plan.dto

import com.backend.domain.plan.entity.Plan
import java.time.LocalDateTime

@JvmRecord
data class PlanResponseBody(
    val id: Long,
    @JvmField val title: String,
    val content: String,
    val startDate: LocalDateTime,
    val endDate: LocalDateTime
) {
    constructor(plan: Plan?) : this(
        plan!!.id!!,
        plan.title,
        plan.content,
        plan.startDate,
        plan.endDate
    )
}
