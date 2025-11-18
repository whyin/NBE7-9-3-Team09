import React, { useEffect } from "react";  // 🔸 useEffect import 수정
import { Routes, Route } from "react-router-dom";
import "./UserApp.css";

import PlanApp from "./plan/PlanApp";
import PlacesApp from "./places/PlacesApp";
import MemberApp from "./member/MemberApp";
import BookmarkApp from "./bookmark/BookmarkApp";
import ReviewApp from "./pages/ReviewApp";
import HomePage from "./pages/HomePage";

function UserApp() {

  // 🔸 [추가된 코드] 기존 카카오 로그인 회원 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("accessToken");

    if (token) {
      localStorage.setItem("accessToken", token); // 토큰 저장
      
      window.history.replaceState({}, "", "/user"); // URL 정리
    }
  }, []); // 최초 1회만 실행

  return (
    <div className="user-app">
      <Routes>
        {/* ⭐ /user → UserApp 진입 후 HomePage 표시 */}
        <Route path="/" element={<HomePage />} />

        
        <Route path="plan/*" element={<PlanApp />} />
        <Route path="places/*" element={<PlacesApp />} />
        <Route path="review/*" element={<ReviewApp />} />
        <Route path="bookmark/*" element={<BookmarkApp />} />
        <Route path="member/*" element={<MemberApp />} />
      </Routes>
    </div>
  );
}

export default UserApp;