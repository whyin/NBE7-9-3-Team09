package com.backend.domain.admin.controller

import com.backend.domain.admin.dto.response.MemberAdminResponse
import com.backend.domain.admin.service.AdminMemberService
import com.backend.global.response.ApiResponse
import com.backend.global.response.ApiResponse.Companion.success
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/members")
class AdminMemberController(
    private val adminMemberService: AdminMemberService
) {

    /** 전체 회원 조회 */
    @GetMapping
    fun getAllMembers(): ApiResponse<List<MemberAdminResponse>> =
        success(adminMemberService.getAllMembers())

    /** 전체 회원 조회 - 페이징 처리 */
    @GetMapping("/page")
    fun getPagedMembers(
        @RequestParam(defaultValue = "0") page: Int,
    ): ApiResponse<Page<MemberAdminResponse>> =
        success(adminMemberService.getAllMembers(PageRequest.of(page, 7)))

    /** 회원 단건 조회  */
    @GetMapping("/{id}")
    fun getMemberById(@PathVariable id: Long): ApiResponse<MemberAdminResponse?> =
        success(adminMemberService.getMemberById(id))

    /** 회원 삭제  */
    @DeleteMapping("/{id}")
    fun deleteMember(@PathVariable id: Long): ApiResponse<Unit> {
        adminMemberService.deleteMember(id)
        return success(Unit, "회원 삭제 완료")
    }

    /** 회원 RefreshToken 무효화  */
    @DeleteMapping("/{id}/token")
    fun invalidateRefreshToken(@PathVariable id: Long): ApiResponse<Unit> {
        adminMemberService.invalidateRefreshToken(id)
        return success(Unit, "RefreshToken 무효화 완료")
    }
}
