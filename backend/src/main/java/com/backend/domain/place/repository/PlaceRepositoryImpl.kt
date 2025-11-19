package com.backend.domain.place.repository

import com.backend.domain.place.entity.Place
import com.backend.domain.place.entity.QPlace
import com.querydsl.core.types.dsl.BooleanExpression
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.support.PageableExecutionUtils

class PlaceRepositoryImpl(
    private val jpaQueryFactory: JPAQueryFactory
) : PlaceRepositoryCustom {

    override fun findPagedByCategoryId(
        categoryId: Long,
        keyword: String?,
        pageable: Pageable
    ): Page<Place> {
        val place = QPlace.place

        var predicate: BooleanExpression = place.category.id.eq(categoryId)

        if (!keyword.isNullOrBlank()) {
            val trimmed = keyword.trim()

            val keywordPredicate: BooleanExpression =
                place.placeName.containsIgnoreCase(trimmed)
                    .or(place.address.containsIgnoreCase(trimmed))
                    .or(place.gu.containsIgnoreCase(trimmed))

            predicate = predicate.and(keywordPredicate)
        }

        val query = jpaQueryFactory
            .selectFrom(place)
            .where(predicate)

        // 정렬 조건 추가 (필요시)
        // pageable.sort.forEach { order ->
        //     val path = when (order.property.lowercase()) {
        //         "id" -> place.id
        //         "createdat" -> place.createdAt  // 필드에 맞게 수정
        //         else -> null
        //     }
        //
        //     path?.let {
        //         query.orderBy(
        //             OrderSpecifier(
        //                 if (order.isAscending) Order.ASC else Order.DESC,
        //                 it
        //             )
        //         )
        //     }
        // }

        val content = query
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()

        return PageableExecutionUtils.getPage(content, pageable) {
            jpaQueryFactory
                .select(place.count())
                .from(place)
                .where(predicate)
                .fetchOne() ?: 0L
        }
    }
}
