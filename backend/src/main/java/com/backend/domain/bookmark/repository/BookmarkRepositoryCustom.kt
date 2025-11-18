package com.backend.domain.bookmark.repository

import com.backend.domain.bookmark.entity.Bookmark
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface BookmarkRepositoryCustom {
    fun findPagedByMember(memberId: Long, pageable: Pageable): Page<Bookmark>
}