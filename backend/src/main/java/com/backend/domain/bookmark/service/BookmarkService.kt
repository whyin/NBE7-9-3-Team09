package com.backend.domain.bookmark.service

import com.backend.domain.bookmark.dto.BookmarkRequestDto
import com.backend.domain.bookmark.dto.BookmarkResponseDto
import com.backend.domain.bookmark.dto.BookmarkResponseDto.Companion.from
import com.backend.domain.bookmark.entity.Bookmark
import com.backend.domain.bookmark.entity.Bookmark.Companion.create
import com.backend.domain.bookmark.repository.BookmarkRepository
import com.backend.domain.member.entity.Member
import com.backend.domain.member.service.MemberService
import com.backend.domain.place.service.PlaceService
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import lombok.RequiredArgsConstructor
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import java.util.function.Consumer
import java.util.function.Supplier
import java.util.stream.Collectors

@Service
@RequiredArgsConstructor
class BookmarkService {
    private val bookmarkRepository: BookmarkRepository? = null
    private val memberService: MemberService? = null
    private val placeService: PlaceService? = null

    /**
     * 북마크 생성
     * - 이미 소프트 삭제된 엔티티가 있으면 재활성화(삭제일 제거, createdAt 갱신)
     */
    @Transactional
    fun create(request: BookmarkRequestDto, memberId: Long?): BookmarkResponseDto? {
        val member = memberService!!.findById(memberId)
        val place = placeService!!.findPlaceById(request.placeId)
        // 활성 상태의 북마크가 이미 있으면 중복
        bookmarkRepository!!.findByMemberAndPlaceAndDeletedAtIsNull(member, place)!!
            .ifPresent(Consumer { b: Bookmark? ->
                throw BusinessException(ErrorCode.ALREADY_EXISTS_BOOKMARK)
            })
        // 소프트 삭제된 항목이 있었으면 재활성화
        val maybe: Optional<Bookmark>? =
            bookmarkRepository.findByMemberAndPlace(member, place) // Optional<Bookmark> 반환 받음
        if (maybe!!.isPresent()) {
            val exist = maybe.get()
            exist.reactivate()
            val saved = bookmarkRepository.save<Bookmark>(exist)
            return from(saved)
        }

        // 신규 생성
        val bookmark = create(member, place)
        val saved = bookmarkRepository.save<Bookmark>(bookmark)
        return from(saved)
    }

    /**
     * 북마크 목록 조회 (최근 저장 순), read-only 트랜잭션
     */
    @Transactional(readOnly = true)
    fun getList(memberId: Long?): MutableList<BookmarkResponseDto?> {
        val member = Member.builder().id(memberId).build()

        return bookmarkRepository!!.findAllByMemberAndDeletedAtIsNullOrderByCreatedAtDesc(member)!!
            .stream()
            .map<BookmarkResponseDto?> { obj: Bookmark? -> BookmarkResponseDto.Companion.from() }
            .collect(Collectors.toList())
    }

    /**
     * 소프트 삭제: deletedAt = now()
     */
    @Transactional
    fun delete(memberId: Long, bookmarkId: Long) {
        val bookmark = bookmarkRepository!!.findById(bookmarkId)
            .orElseThrow<BusinessException?>(Supplier { BusinessException(ErrorCode.NOT_FOUND_BOOKMARK) })

        // 소유자 확인
        if (memberId == null || bookmark.getMember() == null) {
            throw BusinessException(ErrorCode.FORBIDDEN_BOOKMARK)
        }

        val ownerId: Long = bookmark.getMember().getId()
        if (ownerId != memberId) {
            throw BusinessException(ErrorCode.FORBIDDEN_BOOKMARK)
        }

        if (bookmark!!.isDeleted) {
            return  // 이미 삭제된 상태면 멱등성 보장
        }

        bookmark.delete() // 엔티티 내 헬퍼 사용 (deletedAt = now())
        bookmarkRepository.save<Bookmark?>(bookmark)
    }
}
