// 📁 src/user/member/logout/Logout.js
import "../Member.css";
import React from "react";
import { apiRequest } from "../../../utils/api";

const Logout = () => {
  const handleLogout = async () => {
    try {
      const response = await apiRequest("http://localhost:8080/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        localStorage.removeItem("accessToken");
        alert("🚪 로그아웃 완료!");
        window.location.href = "/user/member/login";
      } else {
        alert("로그아웃 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류로 로그아웃에 실패했습니다.");
    }
  };

  return (
    <div className="member-container">
      <h2>로그아웃</h2>

      <div className="member-form">
        <p>로그아웃 하시겠습니까?</p>
        <button onClick={handleLogout} className="member-button secondary">
          로그아웃
        </button>
      </div>

      <a
        href="/user/member/login/member/mypage"
        className="member-link"
        /* 마이페이지 실제 경로로 수정 */
      >
        마이페이지로 돌아가기
      </a>
    </div>
  );
};

export default Logout;
