package com.backend.domain.category.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
class Category(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true, length = 50)
    var name: String = "",

    var createdDate: LocalDateTime? = null,
    var updatedDate: LocalDateTime? = null
)