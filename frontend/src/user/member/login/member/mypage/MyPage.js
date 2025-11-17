import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../../../utils/api"; // ✅ 경로 수정됨 (5단계)
import PageHeader from "../../../../components/common/PageHeader";
import "../../../Member.css"; // ✅ 경로 수정됨 (3단계)

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [editData, setEditData] = useState({ email: "", nickname: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ 내 정보 불러오기
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const res = await apiRequest("http://localhost:8080/api/members/me", {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) throw new Error("조회 실패");

        setUserInfo(data.data);
        setEditData({
          email: data.data.email || "",
          nickname: data.data.nickname || "",
        });
      } catch (err) {
        console.error(err);
        alert("로그인이 필요합니다.");
        navigate("/user/member/login");
      }
    };
    fetchMyInfo();
  }, [navigate]);

  // ✅ 회원정보 수정
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await apiRequest("http://localhost:8080/api/members/me", {
        method: "PATCH",
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "수정 실패");

      setUserInfo(data.data);
      setMessage("✅ 회원정보가 수정되었습니다.");
    } catch (err) {
      console.error(err);
      setMessage("❌ 수정 중 오류가 발생했습니다.");
    }
  };

  // ✅ 회원 탈퇴
  const handleDelete = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까? 되돌릴 수 없습니다.")) return;

    try {
      const res = await apiRequest("http://localhost:8080/api/members/me", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "탈퇴 실패");

      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("accessToken");
      navigate("/user/member/signup");
    } catch (err) {
      console.error(err);
      alert("❌ 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="member-container">
      <PageHeader title="마이페이지" />

      {userInfo ? (
        <div className="member-form">
          <div className="profile-info">
            <p>
              <strong>아이디:</strong> {userInfo.memberId}
            </p>
            <p>
              <strong>이메일:</strong> {userInfo.email}
            </p>
            <p>
              <strong>닉네임:</strong> {userInfo.nickname}
            </p>
          </div>

          <div className="divider"></div>

          <h3>회원정보 수정</h3>
          <form onSubmit={handleUpdate} className="edit-form">
            <input
              type="email"
              name="email"
              placeholder="이메일 수정"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
              required
            />
            <input
              type="text"
              name="nickname"
              placeholder="닉네임 수정"
              value={editData.nickname}
              onChange={(e) =>
                setEditData({ ...editData, nickname: e.target.value })
              }
              required
            />
            <button type="submit" className="member-button">
              수정하기
            </button>
          </form>

          {message && (
            <p
              className={
                message.startsWith("✅") ? "success-text" : "error-text"
              }
            >
              {message}
            </p>
          )}

          <div className="divider"></div>

          {/* ✅ 회원 탈퇴 버튼 */}
          <button onClick={handleDelete} className="member-button danger">
            회원 탈퇴하기
          </button>

          {/* ✅ 회원 홈으로 돌아가기 버튼 */}
          <button
            type="button"
            onClick={() => navigate("/user/member")}
            className="member-button secondary"
            style={{ marginTop: "1rem" }}
          >
            ← 회원 홈으로 돌아가기
          </button>
        </div>
      ) : (
        <p>불러오는 중...</p>
      )}
    </div>
  );
};

export default MyPage;
