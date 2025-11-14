package com.backend.domain.plan.entity

import com.backend.domain.member.entity.Member
import jakarta.persistence.*
import lombok.AllArgsConstructor
import lombok.Builder
import lombok.Getter
import lombok.NoArgsConstructor
import org.hibernate.annotations.ColumnDefault
import java.time.LocalDateTime

@Entity
@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Table(
    name = "plan_member",
    uniqueConstraints = [UniqueConstraint(name = "UC_MEMBER_PLAN", columnNames = ["member_id", "plan_id"])]
)
class PlanMember(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne
    var member: Member,

    @ManyToOne
    var plan: Plan,

    var addDate: LocalDateTime? = LocalDateTime.now(),
    var updateDate: LocalDateTime? = LocalDateTime.now(),
    @ColumnDefault("0")
    var isConfirmed: Int =0,
) {


    fun inviteAccept(): PlanMember {
        this.isConfirmed = 1
        return this
    }

    fun inviteDeny(): PlanMember {
        this.isConfirmed = -1
        return this
    }

    fun isConfirmed(): Boolean {
        return this.isConfirmed == 1
    }

    fun inviteStatusString(): String {
        if (isConfirmed == -1) {
            return "거절함"
        }
        if (isConfirmed == 0) {
            return "초대됨"
        }
        if (isConfirmed == 1) {
            return "승낙함"
        }

        return "값이 올바르지 않습니다."
    }
}
