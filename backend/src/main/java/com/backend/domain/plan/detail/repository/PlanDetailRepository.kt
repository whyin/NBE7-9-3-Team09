package com.backend.domain.plan.detail.repository

import com.backend.domain.plan.detail.entity.PlanDetail
import com.backend.domain.plan.entity.Plan
import jakarta.validation.constraints.NotNull
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*

@Repository
interface PlanDetailRepository : JpaRepository<PlanDetail?, Long?> {
    fun getPlanDetailById(planDetailId: Long): PlanDetail?

    fun getPlanDetailsByPlanId(planId: Long): MutableList<PlanDetail>

    @Query("""
SELECT COUNT(pd)>0
FROM PlanDetail pd
WHERE pd.plan.id = :planId
AND NOT (:endTime < pd.startTime OR :startTime > pd.endTime)
AND (:#{#detailId} IS NULL OR pd.id != :detailId)
    """)
    fun existsOverlapping(
        @Param("planId") planId: Long,
        @Param("endTime") startTime: @NotNull LocalDateTime?,
        @Param("startTime") endTime: LocalDateTime,
        @Param("detailId") detailId: Long?
    ): Boolean

    fun deletePlanDetailsByPlan(plan: Plan)

    fun getPlanDetailsByMemberId(memberId: Long): MutableList<PlanDetail>

    @Query("""
        SELECT
        pd
        FROM
        PlanDetail pd,
        Plan p,
        PlanMember pm
        WHERE
        pd.plan.id = :planId
        AND 
        p.id = :planId
        AND
        (pm.plan.id = :planId AND pm.member.id = :memberId)
        AND 
        pm.isConfirmed = 1
    """)
    fun getPlanDetailsByPlanAndMemberIdWithInviteCheck(
        planId: Long,
        memberId: Long
    ): List<PlanDetail>

}
