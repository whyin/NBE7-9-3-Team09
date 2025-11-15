package com.backend.global.exception

import com.backend.global.response.ErrorCode
import lombok.Getter

@Getter
class BusinessException(val errorCode: ErrorCode, ) : RuntimeException(){
    override val message: String = errorCode.message
}