import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./login/Login";
import Signup from "./signup/Signup";
import Member from "./login/member/Member";
import MyPage from "./login/member/mypage/MyPage";
import Logout from "./login/member/logout/Logout";
import AdminApp from "./login/admin/AdminApp"; // ✅ 관리자 페이지
import "./Member.css";

// ✅ 회원 홈: 로그인 / 회원가입 버튼 화면
const MemberHome = () => (
  <div className="member-container">
    <h2>회원 페이지</h2>
    <p>로그인 또는 회원가입을 선택하세요.</p>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        marginTop: "2rem",
      }}
    >
      <Link to="/user/member/login" className="member-button">
        로그인
      </Link>
      <Link to="/user/member/signup" className="member-button">
        회원가입
      </Link>
    </div>
  </div>
);

const MemberApp = () => {
  return (
    <div className="member-app">
      <Routes>
        {/* ✅ 기본 진입 시 */}
        <Route index element={<MemberHome />} />

        {/* ✅ 로그인 & 회원가입 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ 로그인 성공 후 회원 전용 페이지 */}
        <Route path="/login/member" element={<Member />} />
        <Route path="/login/member/mypage" element={<MyPage />} />
        <Route path="/login/member/logout" element={<Logout />} />

        {/* ✅ 관리자 페이지 (ADMIN role 전용) */}
        <Route path="/login/admin/*" element={<AdminApp />} />
      </Routes>
    </div>
  );
};

export default MemberApp;
