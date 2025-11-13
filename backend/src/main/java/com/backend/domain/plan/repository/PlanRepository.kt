package com.backend.domain.plan.repository

import com.backend.domain.plan.entity.Plan
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*

@Repository
interface PlanRepository : JpaRepository<Plan?, Long?> {
    fun getPlansByMember_MemberId(memberID: String?): MutableList<Plan?>?

    fun getPlanById(id: Long?): Optional<Plan?>?

    fun getPlansByMember_Id(memberId: Long?): MutableList<Plan?>?

    fun getPlanByStartDateAndMemberId(startDate: LocalDateTime?, memberId: Long?): Optional<Plan?>?
}
