package com.backend.domain.plan.dto

import jakarta.validation.constraints.NotNull


data class PlanMemberAnswerRequestBody(
    val planMemberId: @NotNull Long,
    val memberId: @NotNull Long,
    val planId: @NotNull Long
)
