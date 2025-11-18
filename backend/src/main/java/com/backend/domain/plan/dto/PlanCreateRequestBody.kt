package com.backend.domain.plan.dto

import com.backend.domain.member.entity.Member
import com.backend.domain.plan.entity.Plan
import jakarta.validation.constraints.NotEmpty
import org.antlr.v4.runtime.misc.NotNull
import java.time.LocalDateTime


data class PlanCreateRequestBody(
    val title: @NotEmpty String,
    val content: String,
    val startDate: LocalDateTime,
    val endDate: LocalDateTime
) {
    fun toEntity(member: Member): Plan {
        return Plan(
            null,
            member,
            null,
            null,
            startDate,
            endDate,
            title,
            content
        )
    }
}
