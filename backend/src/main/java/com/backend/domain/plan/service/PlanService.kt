package com.backend.domain.plan.service

import com.backend.domain.member.entity.Member
import com.backend.domain.member.service.MemberService
import com.backend.domain.plan.detail.repository.PlanDetailRepository
import com.backend.domain.plan.dto.PlanCreateRequestBody
import com.backend.domain.plan.dto.PlanResponseBody
import com.backend.domain.plan.dto.PlanUpdateRequestBody
import com.backend.domain.plan.entity.Plan
import com.backend.domain.plan.entity.PlanMember
import com.backend.domain.plan.repository.PlanMemberRepository
import com.backend.domain.plan.repository.PlanRepository
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
open class PlanService(
    private val planRepository: PlanRepository,
    private val planMemberRepository: PlanMemberRepository,
    private val memberService: MemberService,
    private val planDetailRepository: PlanDetailRepository,

    ) {

    @Transactional
    open fun createPlan(planCreateRequestBody: PlanCreateRequestBody, memberPkId: Long): Plan {
        val member = memberService.findById(memberPkId)
        val plan = planCreateRequestBody.toEntity(member)
        hasValidPlan(plan,memberPkId)
        val savedPlan = planRepository.save<Plan>(plan)
        planMemberRepository.save<PlanMember?>(
            PlanMember(null, member, plan, null, null, 1)
        ) // 단순 저장이므로 레포지토리 사용.

        if(planCreateRequestBody.inviteMembers.isNotEmpty()){ // 리스트에 있는 모든 회원 초대
            for(invitedMemberPkId in planCreateRequestBody.inviteMembers) {
                val planMember = PlanMember(
                    null,
                    memberService.findById(invitedMemberPkId),
                    savedPlan,
                    LocalDateTime.now(),
                    LocalDateTime.now(),
                    0)
                planMemberRepository.save<PlanMember?>(planMember)
            }
        }
        return savedPlan
    }

    fun getPlanList(memberPkId: Long): List<PlanResponseBody> {
        val plans = planRepository.getAllMyAcceptedPlansByMemberId(memberPkId)
        return plansMapToPlanResponseBodies(plans,memberPkId)
    }

    fun getInvitedAcceptedPlan(memberPkId: Long): List<PlanResponseBody>{
        val plans = planRepository.getAllMyAcceptedPlansByMemberId(memberPkId)
        return plansMapToPlanResponseBodies(plans,memberPkId)
    }

    @Transactional
    open fun updatePlan(
        planId: Long,
        planUpdateRequestBody: PlanUpdateRequestBody,
        memberPkId: Long
    ): PlanResponseBody {
        val member = memberService.findById(memberPkId)
        val plan = getPlanById(planId)
        isSameMember(plan, member)
        hasValidPlan(plan,memberPkId)

        val newPlan: Plan = plan.updatePlan(planUpdateRequestBody, member);
        planRepository.save<Plan>(newPlan)
        return PlanResponseBody(newPlan)
    }

    @Transactional
    open fun deletePlanById(planId: Long, memberPkId: Long) {
        val plan = getPlanById(planId)
        val member = memberService.findById(memberPkId)
        isSameMember(plan, member)
        planMemberRepository.deletePlanMembersByPlan(plan)
        planDetailRepository.deletePlanDetailsByPlan(plan)
        planRepository.deleteById(planId)
    }

    fun getPlanResponseBodyById(planId: Long): PlanResponseBody {
        return PlanResponseBody(getPlanById(planId))
    }

    fun getPlanById(planId: Long?): Plan {
        return planRepository.findById(planId).orElseThrow<BusinessException?>(
            java.util.function.Supplier { BusinessException(com.backend.global.response.ErrorCode.NOT_FOUND_PLAN) }
        )!!
    }

    fun getTodayPlan(memberPkId: Long): PlanResponseBody {
        val todayStart = LocalDateTime.now().toLocalDate().atStartOfDay()
        val plan = planRepository.getPlanByStartDateAndMemberId(todayStart, memberPkId)?:throw BusinessException(ErrorCode.NOT_FOUND_PLAN)
        return PlanResponseBody(plan)
    }

    private fun hasValidPlan(plan: Plan,memberPkId: Long) {
        if (plan.startDate.isAfter(plan.endDate))throw BusinessException(ErrorCode.NOT_VALID_DATE)
        if (plan.startDate.isBefore(LocalDateTime.now().toLocalDate().atStartOfDay().minusSeconds(1))) throw BusinessException(ErrorCode.NOT_VALID_DATE)
        if (plan.endDate.isAfter(LocalDateTime.now().plusYears(10))) throw BusinessException(ErrorCode.NOT_VALID_DATE)
        if (planRepository.existsOverlappingPlan(plan.id, memberPkId,plan.startDate,plan.endDate)) throw BusinessException(ErrorCode.NOT_VALID_DATE)
    }

    private fun isSameMember(plan: Plan, member: Member) {
        if (member.id != plan.member.id) {
            throw BusinessException(ErrorCode.NOT_SAME_MEMBER)
        }
    }

    private fun plansMapToPlanResponseBodies(plans: List<Plan>,memberPkId: Long): List<PlanResponseBody> {
        return plans.map {
            if(memberPkId == it.member.id) PlanResponseBody(it)
            else PlanResponseBody( it.invitedPlan())
        }
    }
}
