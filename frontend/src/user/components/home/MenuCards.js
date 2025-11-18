import React from "react";
import { useNavigate } from "react-router-dom";
import "./MenuCards.css";

const navMenuItems = [
  { icon: "🏠", label: "홈", path: "/user" },
  { icon: "🗺️", label: "여행계획", path: "/user/plan" },
  { icon: "📍", label: "장소", path: "/user/places" },
  { icon: "⭐", label: "리뷰", path: "/user/review" },
  { icon: "🔖", label: "북마크", path: "/user/bookmark" },
  {
    icon: "👤",
    label: "마이페이지",
    path: "/user/member/login/member/mypage", /* UserApp 중첩 경로에 맞춘 실제 마이페이지 URL */
  },
];

const MenuCards = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/user/member/login"); /* 로그아웃 후 회원 로그인 화면으로 이동 */
  };

  return (
    <nav className="top-navigation">
      <div className="nav-menu-group">
        {navMenuItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className="nav-menu-item"
            onClick={() => handleNavigate(item.path)}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="nav-text">{item.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="nav-logout-button"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </nav>
  );
};

export default MenuCards;
