package com.backend.domain.plan.detail.service

import com.backend.domain.member.entity.Member
import com.backend.domain.member.service.MemberService
import com.backend.domain.place.service.PlaceService
import com.backend.domain.plan.detail.dto.PlanDetailRequestBody
import com.backend.domain.plan.detail.dto.PlanDetailResponseBody
import com.backend.domain.plan.detail.dto.PlanDetailsElementBody
import com.backend.domain.plan.detail.entity.PlanDetail
import com.backend.domain.plan.detail.repository.PlanDetailRepository
import com.backend.domain.plan.entity.Plan
import com.backend.domain.plan.service.PlanMemberService
import com.backend.domain.plan.service.PlanService
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import lombok.RequiredArgsConstructor
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.LocalTime
import java.util.function.Supplier

@Service
@RequiredArgsConstructor
class PlanDetailService(
    private val planService: PlanService,
    private val planMemberService: PlanMemberService,
    private val memberService: MemberService,
    private val placeService: PlaceService,
    private val planDetailRepository: PlanDetailRepository,
) {


    @Transactional
    fun addPlanDetail(requestBody: PlanDetailRequestBody, memberPkId: Long): PlanDetail {
        val member = getAvailableMember(requestBody.planId, memberPkId)
        val plan = planService.getPlanById(requestBody.planId)
        val place = placeService.findPlaceById(requestBody.placeId)

        val planDetail = PlanDetail(member, plan, place, requestBody)
        checkValidTime(requestBody, plan, planDetail)
        val savedPlanDetail = this.planDetailRepository.save<PlanDetail>(planDetail)
        return savedPlanDetail
    }


    fun getPlanDetailById(planDetailId: Long, memberPkId: Long): PlanDetailsElementBody {
        val planDetail = getPlanDetailById(planDetailId)
        getAvailableMember(planDetail.plan?.id?: throw BusinessException(ErrorCode.INVALID_MEMBER)
        , memberPkId)

        return PlanDetailsElementBody(planDetail)
    }

    @Transactional
    fun getPlanDetailsByPlanId(planId: Long, memberPkId: Long): MutableList<PlanDetailsElementBody?> {
        getAvailableMember(planId, memberPkId)

        val planDetails = planDetailRepository.getPlanDetailsByPlanId(planId)

        val planDetailList : List<PlanDetailsElementBody> = planDetails.map{
            PlanDetailsElementBody(it)
        }.toList()

        return planDetailList as MutableList<PlanDetailsElementBody?>
    }


    fun getTodayPlanDetails(planId: Long, memberPkId: Long): MutableList<PlanDetailsElementBody?> {
        getAvailableMember(planId, memberPkId)
        val planDetails = planDetailRepository.getPlanDetailsByPlanId(planId)
        return planDetails.stream().filter { planDetail: PlanDetail ->
            planDetail.endTime.isAfter(
                LocalDateTime.now().toLocalDate().atStartOfDay()
            ) && planDetail.startTime.isBefore(
                LocalDateTime.now().toLocalDate().atTime(LocalTime.MAX)
            )
        }.map<PlanDetailsElementBody?> { planDetail: PlanDetail? -> PlanDetailsElementBody(planDetail) }.toList()
    }

    @Transactional
    fun updatePlanDetail(
        planDetailRequestBody: PlanDetailRequestBody,
        memberPkId: Long,
        planDetailId: Long
    ): PlanDetailResponseBody {
        getAvailableMember(planDetailRequestBody.planId, memberPkId)

        val place = placeService.findPlaceById(planDetailRequestBody.placeId)
        val planDetail = getPlanDetailById(planDetailId)
        checkValidTime(planDetailRequestBody, planService.getPlanById(planDetailRequestBody.planId), planDetail)
        planDetail.updatePlanDetail(planDetailRequestBody, place)
        planDetailRepository.save<PlanDetail?>(planDetail)
        return PlanDetailResponseBody(planDetail)
    }

    @Transactional
    fun deletePlanDetail(planDetailId: Long, memberPkId: Long) {
        val planDetail = getPlanDetailById(planDetailId)
        getAvailableMember(planDetail.plan?.id, memberPkId)
        planDetailRepository.deleteById(planDetailId)
    }


    private fun getPlanDetailById(planDetailId: Long): PlanDetail {
        return planDetailRepository.getPlanDetailById(planDetailId).orElseThrow<BusinessException?>(Supplier {
            BusinessException(
                ErrorCode.NOT_FOUND_DETAIL_PLAN
            )
        })
    }


    private fun getAvailableMember(planId: Long, memberPkId: Long): Member {
        val member = memberService.findById(memberPkId)
        val plan = planService.getPlanById(planId)
        if (!planMemberService.isAvailablePlanMember(planId, member)) {
            throw BusinessException(ErrorCode.NOT_ALLOWED_MEMBER)
        }

        return member
    }

    //시간이 유효한 시간인지
    private fun checkValidTime(planDetailRequestBody: PlanDetailRequestBody, plan: Plan, planDetail: PlanDetail) {
        // 계획 내에서 시간이 겹치지 않는지 검사
        if (planDetailRepository.existsOverlapping(
                planDetailRequestBody.planId,
                planDetailRequestBody.startTime,
                planDetailRequestBody.endTime,
                planDetail.id
            )
        ) {
            throw BusinessException(ErrorCode.CONFLICT_TIME)
        }

        //계획 안의 시간인지
        if (planDetailRequestBody.startTime.isBefore(plan.startDate) || planDetailRequestBody.endTime?.isAfter(plan.endDate)) {
            throw BusinessException(ErrorCode.NOT_VALID_DATE)
        }
        // 지금으로부터 10년 뒤 까지만 계획 설정 가능
        if (planDetailRequestBody.startTime?.isAfter(LocalDateTime.now().plusYears(10))) {
            throw BusinessException(ErrorCode.NOT_VALID_DATE)
        }
    }
}
