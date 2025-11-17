import React from "react";
import { useNavigate } from "react-router-dom";
import "./MenuCards.css";

const MenuCards = () => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, name: "여행계획", path: "/user/plan", icon: "🗺️" },
    { id: 2, name: "여행지", path: "/user/places", icon: "🏛️" },
    { id: 3, name: "리뷰", path: "/user/review", icon: "⭐" },
    { id: 4, name: "북마크", path: "/user/bookmark", icon: "📌" },
    {
      id: 5,
      name: "마이페이지",
      path: "/user/member/login/member/mypage",
      icon: "👤",
    },
  ];

  const handleClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // 로컬스토리지에서 토큰과 사용자 정보 삭제
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    // 로그인 화면으로 리다이렉트
    window.location.href = "/";
  };

  return (
    <nav className="top-navigation">
      <div className="nav-menu-group">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="nav-menu-item"
            onClick={() => handleClick(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </button>
        ))}
      </div>
      <button className="nav-logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </nav>
  );
};

export default MenuCards;
