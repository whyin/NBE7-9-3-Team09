package com.backend.domain.plan.dto

import com.backend.domain.plan.entity.PlanMember

@JvmRecord
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

    constructor(memberLoginId: String,planTitle: String,isComfirmed: Int): this(
        memberLoginId,
        planTitle,
        isComfirmed == 1
    )
}
