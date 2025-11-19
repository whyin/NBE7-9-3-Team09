package com.backend.domain.plan.dto

import com.backend.domain.plan.entity.PlanMember


data class PlanMemberResponseBody(
    val memberLoginId: String,
    val planTitle: String,
    val isConfirmed: Boolean,
) {
    constructor(planMember: PlanMember) : this(
        planMember.member.memberId,
        planMember.plan.title,
        planMember.isConfirmed == 1
    )

    constructor(memberLoginId: String, planTitle: String, isConfirmed: Int): this(
        memberLoginId,
        planTitle,
        isConfirmed == 1
    )
}
