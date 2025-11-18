import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./user/member/login/Login";
import UserApp from "./user/UserApp";
import AdminApp from "./admin/AdminApp";
import Oauth2Signup from "./user/member/signup/Oauth2Signup";

function App() {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>

        {/* ⭐ 신규 회원가입 */}
        <Route path="/oauth2/signup" element={<Oauth2Signup />} />

        {/* ⭐ 사용자 페이지 */}
        <Route
          path="/user/*"
          element={
            token ? <UserApp /> : <Navigate to="/" replace />
          }
        />

        {/* ⭐ 관리자 페이지 */}
        <Route
          path="/admin/*"
          element={
            token && role === "ADMIN"
              ? <AdminApp />
              : <Navigate to="/" replace />
          }
        />

        {/* ⭐ 기본 로그인 */}
        <Route path="/" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;