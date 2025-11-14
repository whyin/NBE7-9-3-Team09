package com.backend.domain.place.entity

import com.backend.domain.category.entity.Category
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
class Place(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var placeName: String,

    var address: String? = null,

    @Column(length = 50)
    var gu: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    var category: Category,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @Column(nullable = false)
    var ratingSum: Long = 0L,

    @Column(nullable = false)
    var ratingCount: Int = 0,

    @Column(nullable = false)
    var ratingAvg: Double = 0.0,

    @Version
    var version: Long? = null,

    var createdDate: LocalDateTime? = null,
    var updatedDate: LocalDateTime? = null,
) {

    // JPA 프록시용 protected no-arg 생성자
    protected constructor() : this(
        placeName = "",
        address = null,
        gu = null,
        category = Category(),   // 임시값 — JPA가 실제로는 프록시로 교체함
        description = null
    )

    fun update(
        placeName: String,
        address: String,
        gu: String,
        description: String?
    ) {
        this.placeName = placeName
        this.address = address
        this.gu = gu
        this.description = description
    }
}