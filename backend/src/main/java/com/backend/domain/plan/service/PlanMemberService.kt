package com.backend.domain.plan.service

import com.backend.domain.member.entity.Member
import com.backend.domain.member.service.MemberService
import com.backend.domain.plan.dto.PlanMemberAddRequestBody
import com.backend.domain.plan.dto.PlanMemberAnswerRequestBody
import com.backend.domain.plan.dto.PlanMemberMyResponseBody
import com.backend.domain.plan.dto.PlanMemberResponseBody
import com.backend.domain.plan.entity.PlanMember
import com.backend.domain.plan.repository.PlanMemberRepository
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import lombok.RequiredArgsConstructor
import lombok.extern.slf4j.Slf4j
import org.springframework.stereotype.Service
import java.util.function.Supplier

@Slf4j
@Service
@RequiredArgsConstructor
class PlanMemberService(
    private val planMemberRepository: PlanMemberRepository,
    private val planService: PlanService,
    private val memberService: MemberService
) {


    fun invitePlanMember(requestBody: PlanMemberAddRequestBody, memberId: Long): PlanMemberResponseBody {
        val planMember = isValidInvite(requestBody, memberId)
        planMemberRepository.save<PlanMember?>(planMember)
        return PlanMemberResponseBody(planMember)
    }

    fun myInvitedPlanList(memberPkId: Long): MutableList<PlanMemberMyResponseBody?> {
        val member: Member? = Member(memberPkId)

        val planMemberList = planMemberRepository.getPlanMembersByMember(member)
        val myPlanMemberList =
            planMemberList
                .stream()
                .map<PlanMemberMyResponseBody?> { pm: PlanMember? -> PlanMemberMyResponseBody(pm!!) }
                .toList()
        return myPlanMemberList
    }


    fun DeletePlanMember(requestBody: PlanMemberAddRequestBody, memberPkId: Long): PlanMemberResponseBody {
        val planMember = isValidInvite(requestBody, memberPkId)

        planMemberRepository.delete(planMember)
        return PlanMemberResponseBody(planMember)
    }

    fun acceptInvitePlanMember(requestBody: PlanMemberAnswerRequestBody, memberPkId: Long): PlanMemberResponseBody {
        val planMember = isMyInvite(requestBody, memberPkId)
        planMember.inviteAccept()
        planMemberRepository.save<PlanMember?>(planMember)
        return PlanMemberResponseBody(planMember)
    }

    fun denyInvitePlanMember(requestBody: PlanMemberAnswerRequestBody, memberPkId: Long): PlanMemberResponseBody {
        val planMember = isMyInvite(requestBody, memberPkId)
        planMember.inviteDeny()
        planMemberRepository.save<PlanMember?>(planMember)
        return PlanMemberResponseBody(planMember)
    }

    private fun isValidInvite(requestBody: PlanMemberAddRequestBody, memberId: Long): PlanMember {
        val plan = planService.getPlanById(requestBody.planId)
        if (plan.member.id != memberId) {
            throw BusinessException(ErrorCode.NOT_MY_PLAN)
        }

        val invitedMember = memberService.findById(requestBody.memberId)

        // 데이터 베이스 오류 처리를 서비스 로직 처리로 변경
        if (planMemberRepository.existsByMemberInPlanId(invitedMember.id?:1, plan.id)) {
            throw BusinessException(ErrorCode.DUPLICATE_MEMBER_INVITE)
        }


        val planMember = PlanMember(null, invitedMember, plan, null, null, 0)
        return planMember
    }

    private fun isMyInvite(requestBody: PlanMemberAnswerRequestBody, memberPkId: Long): PlanMember {
        val member: Member = Member(memberPkId)

        val plan = planService!!.getPlanById(requestBody.planId)

        if (requestBody.memberId != member.id) {
            throw BusinessException(ErrorCode.NOT_MY_PLAN)
        }

        val planMember = planMemberRepository!!.findById(requestBody.planMemberId).orElseThrow<BusinessException?>(
            Supplier { BusinessException(ErrorCode.NOT_FOUND_INVITE) }
        )

        return planMember
    }

    fun isAvailablePlanMember(planId: Long, member: Member): Boolean {
        return planMemberRepository!!.existsByMemberInPlanId(member.id!!, planId)
    }
}
