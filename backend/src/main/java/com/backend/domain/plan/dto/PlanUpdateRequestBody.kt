package com.backend.domain.plan.dto

import jakarta.validation.constraints.NotEmpty
import org.antlr.v4.runtime.misc.NotNull
import java.time.LocalDateTime

@JvmRecord
data class PlanUpdateRequestBody(
    @field:NotNull @param:NotNull val id: Long,
    val title: @NotEmpty String,
    val content: String,
    @field:NotNull @param:NotNull val startDate: LocalDateTime,
    @field:NotNull @param:NotNull val endDate: LocalDateTime
)
