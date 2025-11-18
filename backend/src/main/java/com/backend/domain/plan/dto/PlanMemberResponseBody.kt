package com.backend.domain.plan.dto

import com.backend.domain.plan.entity.PlanMember


data class PlanMemberResponseBody(
    val memberLoginId: String,
    val planTitle: String,
    val isComfirmed: Boolean,
) {
    constructor(planMember: PlanMember) : this(
        planMember.member.memberId,
        planMember.plan.title,
        planMember.isConfirmed == 1
    )
}
