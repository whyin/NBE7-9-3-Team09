package com.backend.domain.place.repository

import com.backend.domain.place.entity.Place
import com.backend.domain.place.entity.QPlace
import com.querydsl.core.types.Order
import com.querydsl.core.types.OrderSpecifier
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.support.PageableExecutionUtils

class PlaceRepositoryImpl(
    private val jpaQueryFactory: JPAQueryFactory
) : PlaceRepositoryCustom {

    override fun findPagedByCategoryId(categoryId: Long, pageable: Pageable): Page<Place> {
        val place = QPlace.place

        val query = jpaQueryFactory
            .selectFrom(place)
            .where(
                place.category.id.eq(categoryId)
            )

        // 정렬 적용
//        pageable.sort.forEach { order ->
//            val path = when (order.property.lowercase()) {
//                "id" -> bookmark.bookmarkId
//                "createdAt" -> bookmark.createdAt
//                else -> null
//            }
//
//            path?.let {
//                query.orderBy(
//                    OrderSpecifier(
//                        if (order.isAscending) Order.ASC else Order.DESC,
//                        it
//                    )
//                )
//            }
//        }

        val content = query
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()

        return PageableExecutionUtils.getPage(content, pageable) {
            jpaQueryFactory
                .select(place.count())
                .from(place)
                .where(
                    place.category.id.eq(categoryId)
                )
                .fetchOne() ?: 0L
        }
    }
}