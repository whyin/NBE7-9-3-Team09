package com.backend.domain.bookmark.repository

import com.backend.domain.bookmark.entity.Bookmark
import com.backend.domain.bookmark.entity.QBookmark
import com.querydsl.core.types.Order
import com.querydsl.core.types.OrderSpecifier
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.support.PageableExecutionUtils


class BookmarkRepositoryImpl(
    private val jpaQueryFactory: JPAQueryFactory
) : BookmarkRepositoryCustom {

    override fun findPagedByMember(memberId: Long, pageable: Pageable): Page<Bookmark> {
        val bookmark = QBookmark.bookmark

        val query = jpaQueryFactory
            .selectFrom(bookmark)
            .where(
                bookmark.member.id.eq(memberId)
                    .and(bookmark.deletedAt.isNull)
            )

        // 정렬 적용
        pageable.sort.forEach { order ->
            val path = when (order.property.lowercase()) {
                "id" -> bookmark.bookmarkId
                "createdAt" -> bookmark.createdAt
                else -> null
            }

            path?.let {
                query.orderBy(
                    OrderSpecifier(
                        if (order.isAscending) Order.ASC else Order.DESC,
                        it
                    )
                )
            }
        }

        val content = query
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()

        return PageableExecutionUtils.getPage(content, pageable) {
            jpaQueryFactory
                .select(bookmark.count())
                .from(bookmark)
                .where(
                    bookmark.member.id.eq(memberId)
                        .and(bookmark.deletedAt.isNull)
                )
                .fetchOne() ?: 0L
        }
    }
}
