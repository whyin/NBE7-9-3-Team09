// src/user/member/signup/Oauth2Signup.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Oauth2Signup = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [tempToken, setTempToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      alert("유효하지 않은 접근입니다.");
      navigate("/user/member/login");
      return;
    }

    setTempToken(token);
  }, [navigate]);

  const handleSignup = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/oauth2/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nickname,
            tempToken,
          }),

          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "회원가입 실패");
      }

      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("role", data.data.role);

      // ⭐ accessToken + role 저장 (일반 로그인과 동일)
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("role", data.data.role);

      // ⭐ 일반 로그인 성공 로직과 동일하게 분기 처리
      // --------------------------------------------------------------------
      if (data.data.role === "ADMIN") {
        window.location.href = "/admin";   // ★ 관리자 계정 리다이렉트
      } else {
        window.location.href = "/user";    // ★ 일반회원 리다이렉트
      }
      // --------------------------------------------------------------------

    

      navigate("/user");
    } catch (err) {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className="member-container"
      style={{ position: "relative" }}
    >
      <h2>카카오 신규 회원가입</h2>
      <p>닉네임을 입력해주세요.</p>

      {/* ★ 수정: 여기 입력창을 절대 위치로 올려서 어떤 CSS 레이어에도 가려지지 않게 함 */}
      <input
        type="text"
        placeholder="닉네임을 입력하세요"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{
          position: "absolute",   // ★ 절대 위치
          top: "50%",             // ★ 화면 중앙
          left: "50%",            
          transform: "translate(-50%, -50%)",
          zIndex: 999999,         // ★ 최상위 레이어
          width: "300px",
          padding: "14px",
          fontSize: "18px",
          border: "2px solid #bbb",
          borderRadius: "10px",
          background: "white",
        }}
      />

      <button
        onClick={handleSignup}
        className="member-button"
        style={{
          marginTop: "10rem",
          zIndex: 999999,         // ★ 버튼도 위로 끌어올림
          position: "relative",
        }}
      >
        회원가입 완료
      </button>
    </div>
  );
};

export default Oauth2Signup;
