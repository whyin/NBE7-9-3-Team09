package com.backend.global.exception

import com.backend.global.response.ApiResponse
import com.backend.global.response.ResponseCode
import lombok.extern.slf4j.Slf4j
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.util.MultiValueMap
import org.springframework.validation.ObjectError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.util.stream.Collectors

@Slf4j
@RestControllerAdvice
class GlobalExceptionHandler {
    val log = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentNotValid(e: MethodArgumentNotValidException): ResponseEntity<*> {
        val errorMessage = e.getBindingResult()
            .getAllErrors()
            .stream()
            .map<String?> { error: ObjectError? -> error!!.getDefaultMessage() }
            .collect(Collectors.joining(", "))


        log.warn("Validation Failed : {}", errorMessage)

        val apiResponse = ApiResponse<String>(
            ResponseCode.BAD_REQUEST.code,
            ResponseCode.BAD_REQUEST.message,
            errorMessage
        )

        return ResponseEntity<ApiResponse<String>?>(apiResponse, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(BusinessException::class)
    fun handleBusinessException(e: BusinessException): ResponseEntity<ApiResponse<Void>?> {
        val errorCode = e.errorCode
        log.error(
            "Business exception occurred : Code - {}, Message - {}",
            errorCode,
            errorCode.message
        )
        val apiResponse: ApiResponse<Void> = ApiResponse.error<Void>(errorCode) as ApiResponse<Void>

        return ResponseEntity<ApiResponse<Void>?>(apiResponse, e.errorCode.status)
    }
}
