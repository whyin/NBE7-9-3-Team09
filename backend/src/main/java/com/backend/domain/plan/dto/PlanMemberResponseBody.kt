package com.backend.domain.plan.dto

import com.backend.domain.plan.entity.PlanMember

@JvmRecord
data class PlanMemberResponseBody(
    val memberLoginId: String,
    val planTitle: String
) {
    constructor(planMember: PlanMember) : this(
        planMember.member.memberId,
        planMember.plan.title
    )
}
