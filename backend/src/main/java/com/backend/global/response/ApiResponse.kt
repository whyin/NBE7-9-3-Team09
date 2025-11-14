package com.backend.global.response

import com.backend.domain.bookmark.dto.BookmarkResponseDto
import lombok.AllArgsConstructor
import lombok.Getter

@AllArgsConstructor
@Getter
class ApiResponse<T>(
    val code: String,
    val message: String,
    val data: T? = null
) {
    // TODO : 추후 JvmStatic 어노테이션 제거
    companion object {
        // ResponseCode Status Created인 경우
        @JvmStatic
        fun <T> created(data: T): ApiResponse<T> {
            return ApiResponse<T>(
                ResponseCode.CREATED.code,
                ResponseCode.CREATED.message,
                data
            )
        }
        @JvmStatic
        fun <T> success(data: T?): ApiResponse<T?> {
            return ApiResponse<T?>(
                ResponseCode.CREATED.code,
                ResponseCode.CREATED.message,
                data
            )
        }

        @JvmStatic
        fun <T> success(): ApiResponse<T?> {
            return ApiResponse<T?>(
                ResponseCode.CREATED.code,
                ResponseCode.CREATED.message,
                null
            )
        }

        // custom 메세지 추가
        @JvmStatic
        fun <T> success(data: T, customMessage: String): ApiResponse<T> {
            return ApiResponse<T>(
                ResponseCode.CREATED.code,
                customMessage,
                data
            )
        }

        @JvmStatic
        fun <T> success(customMessage: String): ApiResponse<T?> {
            return ApiResponse<T?>(
                ResponseCode.CREATED.code,
                customMessage,
                null
            )
        }


        @JvmStatic
        fun <T> error(code: ResponseCode): ApiResponse<T?> {
            return ApiResponse<T?>(
                code.code,
                code.message,
                null
            )
        }

        @JvmStatic
        fun <T> error(errorCode: ErrorCode): ApiResponse<T?> {
            return ApiResponse<T?>(
                errorCode.code,
                errorCode.message,
                null
            )
        }
    }
}
