import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./UserApp.css";

import PlanApp from "./plan/PlanApp";
import PlacesApp from "./places/PlacesApp";
import MemberApp from "./member/MemberApp";
import BookmarkApp from "./bookmark/BookmarkApp";
import ReviewApp from "./pages/ReviewApp";
import HomePage from "./pages/HomePage";
import MenuCards from "./components/home/MenuCards";

function UserApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("accessToken")
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");

    if (accessToken) {
      localStorage.setItem(
        "accessToken",
        accessToken
      ); /* 쿼리에서 전달된 토큰 저장 */
      setIsLoggedIn(true);
      navigate("/user", {
        replace: true,
      }); /* 토큰 저장 후 /user 경로만 남기기 */
    }
  }, [location.search, navigate]);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, [location.pathname, location.search]);

  return (
    <div className="user-app">
      {isLoggedIn && <MenuCards />}
      <div
        className={
          isLoggedIn
            ? "user-app__content user-app__content--with-nav"
            : "user-app__content"
        }
      >
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
    </div>
  );
}

export default UserApp;
