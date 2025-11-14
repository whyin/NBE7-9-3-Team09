package com.backend.domain.plan.repository

import com.backend.domain.member.entity.Member
import com.backend.domain.plan.entity.Plan
import com.backend.domain.plan.entity.PlanMember
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface PlanMemberRepository : JpaRepository<PlanMember, Long> {
    fun getPlanMembersByMember(member: Member?): MutableList<PlanMember>

    fun getPlanMembersByPlan(plan: Plan): MutableList<PlanMember>

    fun existsByPlanIdAndMemberId(planId: Long, memberId: Long): Boolean

    @Query("""
SELECT COUNT(pm) > 0
FROM PlanMember pm
WHERE pm.plan.id = :planId
AND pm.member.id = :memberId
""" )
    fun existsByMemberInPlanId(
        @Param("memberId") memberId: Long,
        @Param("planId") planId: Long
    ): Boolean

    fun deletePlanMembersByPlanId(planId: Long)

    fun deletePlanMembersByPlan(plan: Plan)

    fun getPlanMembersByMemberId(memberId: Long): MutableList<PlanMember>


}
