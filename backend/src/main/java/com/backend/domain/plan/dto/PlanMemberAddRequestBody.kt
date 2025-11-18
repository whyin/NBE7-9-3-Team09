package com.backend.domain.plan.dto

import jakarta.validation.constraints.NotNull


data class PlanMemberAddRequestBody(
    val memberId: @NotNull Long,
    val planId: @NotNull Long
)
