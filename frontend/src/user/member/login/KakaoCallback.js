// src/user/member/login/KakaoCallback.js

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      alert("카카오 인가 코드가 없습니다.");
      navigate("/user/member/login");
      return;
    }

    // 카카오 code를 백엔드로 전달
    fetch(`http://localhost:8080/login/oauth2/code/kakao?code=${code}`, {
      method: "GET",
      credentials: "include", // refreshToken 쿠키 수신
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("카카오 로그인 처리 실패");
        }

        // 백엔드에서 redirect 처리하므로 실제 이곳에서는 성공 여부만 확인
      })
      .catch((err) => {
        console.error(err);
        alert("카카오 로그인에 실패했습니다.");
        navigate("/user/member/login");
      });
  }, [navigate]);

  return <div>카카오 로그인 처리 중입니다...</div>;
};

export default KakaoCallback;