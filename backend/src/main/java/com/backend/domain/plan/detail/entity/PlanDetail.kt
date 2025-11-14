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
     val id: Long? = null

    @ManyToOne(fetch = FetchType.LAZY)
    val plan: Plan? = null

    @ManyToOne(fetch = FetchType.LAZY)
    var place: Place? = null

    @ManyToOne(fetch = FetchType.LAZY)
    val member: Member? = null

    var startTime: @NotNull LocalDateTime? = null

    var endTime: @NotNull LocalDateTime? = null

    var title: @NotNull String? = null

    var content: @NotNull String? = null


    fun updatePlanDetail(planDetailRequestBody: PlanDetailRequestBody, place: Place): PlanDetail {
        this.place = place
        this.title = planDetailRequestBody.title
        this.content = planDetailRequestBody.content
        this.startTime = planDetailRequestBody.startTime
        this.endTime = planDetailRequestBody.endTime
        return this
    }
}
