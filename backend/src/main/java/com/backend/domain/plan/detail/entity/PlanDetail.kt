package com.backend.domain.plan.detail.entity

import com.backend.domain.member.entity.Member
import com.backend.domain.place.entity.Place
import com.backend.domain.plan.detail.dto.PlanDetailRequestBody
import com.backend.domain.plan.entity.Plan
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import lombok.AccessLevel
import lombok.Getter
import lombok.NoArgsConstructor
import java.time.LocalDateTime

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
class PlanDetail() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     var id: Long? = null

    @ManyToOne(fetch = FetchType.LAZY)
    var plan: Plan? = null

    @ManyToOne(fetch = FetchType.LAZY)
    var place: Place? = null

    @ManyToOne(fetch = FetchType.LAZY)
    var member: Member? = null

    var startTime: @NotNull LocalDateTime = LocalDateTime.now()

    var endTime: @NotNull LocalDateTime = LocalDateTime.now()

    var title: @NotNull String? = null

    var content: @NotNull String? = null

    constructor(
        member: Member,
        plan: Plan,
        place: Place,
        requestBody: PlanDetailRequestBody
    ) : this() {
        this.member = member
        this.plan = plan
        this.place = place
        this.title = requestBody.title
        this.content = requestBody.content
        this.startTime = requestBody.startTime
        this.endTime = requestBody.endTime
    }

    fun updatePlanDetail(planDetailRequestBody: PlanDetailRequestBody, place: Place): PlanDetail {
        this.place = place
        this.title = planDetailRequestBody.title
        this.content = planDetailRequestBody.content
        this.startTime = planDetailRequestBody.startTime
        this.endTime = planDetailRequestBody.endTime
        return this
    }
}
