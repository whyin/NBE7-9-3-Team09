package com.backend.domain.plan.repository

import com.backend.domain.plan.entity.Plan
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface PlanRepository : JpaRepository<Plan?, Long?> {
    fun getPlansByMember_MemberId(memberID: String?): List<Plan>

    fun getPlanById(id: Long?): Plan?

    fun getPlansByMember_Id(memberId: Long): List<Plan>

    fun getPlanByStartDateAndMemberId(startDate: LocalDateTime?, memberId: Long?): Plan?

    fun getPlanByTitle(title: String?): Plan?

    fun getPlanByStartDateBeforeAndEndDateAfter(startDateBefore: LocalDateTime, endDateAfter: LocalDateTime): Plan?

    @Query("""
        SELECT 
        Plan
        FROM
            Plan p,
            PlanMember pm
        WHERE
            p.id = pm.plan.id
            AND
            pm.member.id = :memberId
            AND
            pm.isConfirmed = 1
    """)
    fun getMyInvitedAcceptedPlansByMemberId(@Param("memberId") memberPkId: Long): List<Plan>

}
