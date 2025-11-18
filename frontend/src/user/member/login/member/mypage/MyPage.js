// 📁 src/user/member/mypage/MyPage.js
import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../../../utils/api";
import "../../../Member.css";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [editData, setEditData] = useState({nickname: "" });
  const [message, setMessage] = useState("");

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
          nickname: data.data.nickname || "",
        });
      } catch (err) {
        console.error(err);
        alert("로그인이 필요합니다.");
        window.location.href = "/user/member/login";
      }
    };
    fetchMyInfo();
  }, []);

  // ✅ 회원정보 수정
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await apiRequest("http://localhost:8080/api/members/me", {
        method: "PATCH",
        body: JSON.stringify({
          nickname: editData.nickname, // ⭐ email 제거
        }),
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
      window.location.href = "/user/member/signup";
    } catch (err) {
      console.error(err);
      alert("❌ 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="member-container">
      <h2>마이페이지</h2>

      {userInfo ? (
        <div className="member-form">
          <div className="profile-info">
            <p><strong>아이디:</strong> {userInfo.memberId}</p>
            <p><strong>이메일:</strong> {userInfo.email}</p>
            <p><strong>닉네임:</strong> {userInfo.nickname}</p>
          </div>

          <div className="divider"></div>

          <h3>회원정보 수정</h3>
          <form onSubmit={handleUpdate} className="edit-form">
            <input
              type="text"
              name="nickname"
              placeholder="닉네임 수정"
              value={editData.nickname}
              onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
              required
            />
            <button type="submit" className="member-button">
              수정하기
            </button>
          </form>

          {message && (
            <p className={message.startsWith("✅") ? "success-text" : "error-text"}>
              {message}
            </p>
          )}

          <div className="divider"></div>

          <button onClick={handleDelete} className="member-button danger">
            회원 탈퇴하기
          </button>
        </div>
      ) : (
        <p>불러오는 중...</p>
      )}
    </div>
  );
};

export default MyPage;