import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./user/member/login/Login";
import UserApp from "./user/UserApp";
import AdminApp from "./admin/AdminApp";
import Oauth2Signup from "./user/member/signup/Oauth2Signup";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const location = useLocation();
  const allowPublicUserRoutes =
    location.pathname.startsWith(
      "/user/member"
    ); /* 회원가입/로그인 경로는 토큰 없이 접근 허용 */
  const hasAccessTokenQuery = new URLSearchParams(location.search).has(
    "accessToken"
  ); /* 소셜 콜백 등에서 토큰이 쿼리로 전달된 경우 UserApp 접근 허용 */

  return (
    <Routes>
      {/* ⭐ 신규 회원가입 */}
      <Route path="/oauth2/signup" element={<Oauth2Signup />} />

      {/* ⭐ 사용자 페이지 */}
      <Route
        path="/user/*"
        element={
          token || allowPublicUserRoutes || hasAccessTokenQuery ? (
            <UserApp />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ⭐ 관리자 페이지 */}
      <Route
        path="/admin/*"
        element={
          token && role === "ADMIN" ? <AdminApp /> : <Navigate to="/" replace />
        }
      />

      {/* ⭐ 기본 로그인 */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
