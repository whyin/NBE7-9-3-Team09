package com.backend.domain.bookmark.service

import com.backend.domain.bookmark.dto.BookmarkRequestDto
import com.backend.domain.bookmark.dto.BookmarkResponseDto
import com.backend.domain.bookmark.entity.Bookmark
import com.backend.domain.bookmark.entity.Bookmark.Companion.create
import com.backend.domain.bookmark.repository.BookmarkRepository
import com.backend.domain.member.service.MemberService
import com.backend.domain.place.service.PlaceService
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class BookmarkService(
    private val bookmarkRepository: BookmarkRepository,
    private val memberService: MemberService,
    private val placeService: PlaceService
) {

    /**
     * 북마크 생성
     */
    @Transactional
    fun create(request: BookmarkRequestDto, memberId: Long): BookmarkResponseDto {
        val member = memberService.findById(memberId)
        val place = placeService.findPlaceById(request.placeId)

        // 활성 상태의 북마크가 이미 존재하면 중복
        bookmarkRepository.findByMemberAndPlaceAndDeletedAtIsNull(member, place)
            .ifPresent { throw BusinessException(ErrorCode.ALREADY_EXISTS_BOOKMARK) }

        // 소프트 삭제된 항목이 있으면 재활성화
        val existingBookmark = bookmarkRepository.findByMemberAndPlace(member, place).orElse(null)
        if (existingBookmark != null) {
            existingBookmark.reactivate()
            val saved = bookmarkRepository.save(existingBookmark)
            return BookmarkResponseDto(saved)
        }

        // 신규 생성
        val bookmark = create(member, place)
        val saved = bookmarkRepository.save(bookmark)
        return BookmarkResponseDto(saved)
    }

    /**
     * 북마크 목록 조회 (최근 저장 순)
     */
    @Transactional(readOnly = true)
    fun getList(memberId: Long): List<BookmarkResponseDto> {
        val member = memberService.findById(memberId)
        return bookmarkRepository.findAllByMemberAndDeletedAtIsNullOrderByCreatedAtDesc(member)
            .map { BookmarkResponseDto(it) }
    }

    /**
     * 소프트 삭제
     */
    @Transactional
    fun delete(memberId: Long, bookmarkId: Long) {
        val bookmark = bookmarkRepository.findById(bookmarkId)
            .orElseThrow { BusinessException(ErrorCode.NOT_FOUND_BOOKMARK) }

        if (bookmark.member.id != memberId) {
            throw BusinessException(ErrorCode.FORBIDDEN_BOOKMARK)
        }

        if (!bookmark.isDeleted) {
            bookmark.delete()
            bookmarkRepository.save(bookmark)
        }
    }
}
