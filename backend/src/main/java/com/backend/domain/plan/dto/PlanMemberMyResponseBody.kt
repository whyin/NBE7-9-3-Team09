package com.backend.domain.plan.dto

import com.backend.domain.plan.entity.PlanMember


data class PlanMemberMyResponseBody(
    val planMemberId: Long,
    val planId: Long,
    val memberLoginId: Long?,
    val planTitle: String,
    val isAccepted: Int

) {
    constructor(planMember: PlanMember) : this(
        planMember.id!!,
        planMember.plan.id!!,
        planMember.member.id,
        planMember.plan.title,
        planMember.isConfirmed
    )
}
