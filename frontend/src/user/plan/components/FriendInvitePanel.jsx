import React, { useState } from "react";
import { apiRequest } from "../../../utils/api";
import "./FriendInvitePanel.css";

export default function FriendInvitePanel({
  invitedMembers = [],
  onInvitesChange,
}) {
  const [emailInput, setEmailInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showStatus = (message, type = "info") => {
    setStatusMessage(message);
    setStatusType(type);
  };

  const clearStatus = () => {
    setStatusMessage("");
    setStatusType("info");
  };

  const handleInviteSubmit = async (event) => {
    event.preventDefault();
    clearStatus();

    const trimmedEmail = emailInput.trim();

    if (trimmedEmail.length === 0) {
      showStatus("이메일을 입력해주세요.", "error");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      showStatus("올바른 이메일 형식을 입력해주세요.", "error");
      return;
    }

    if (invitedMembers.some((member) => member.email === trimmedEmail)) {
      showStatus("이미 추가된 이메일입니다.", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest(
        `http://localhost:8080/api/members/search/email?email=${encodeURIComponent(
          trimmedEmail
        )}`
      );

      if (!response.ok) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }

      const result = await response.json();
      const memberId = result?.data?.id;

      if (!memberId) {
        throw new Error("해당 이메일의 사용자를 찾을 수 없습니다.");
      }

      const updatedList = [
        ...invitedMembers,
        { id: memberId, email: trimmedEmail },
      ];
      onInvitesChange(updatedList);
      showStatus("초대 목록에 추가했습니다.", "success");
      setEmailInput("");
    } catch (error) {
      console.error("이메일 초대 실패:", error);
      showStatus(error.message || "사용자를 찾을 수 없습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveInvite = (memberId) => {
    const updatedList = invitedMembers.filter((member) => member.id !== memberId);
    onInvitesChange(updatedList);
  };

  return (
    <div className="friend-invite-panel">
      <div className="friend-invite-header">
        <h3 className="friend-invite-title">👥 친구 초대</h3>
        <p className="friend-invite-subtitle">
          함께 여행할 친구의 이메일을 입력하세요
        </p>
      </div>

      <form className="friend-invite-search" onSubmit={handleInviteSubmit}>
        <input
          type="email"
          className="friend-invite-search-input"
          placeholder="초대할 친구의 이메일을 입력"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <button
          type="submit"
          className="friend-invite-add-btn primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "확인 중..." : "추가"}
        </button>
      </form>

      {statusMessage && (
        <div className={`friend-invite-status friend-invite-status-${statusType}`}>
          {statusMessage}
        </div>
      )}

      {invitedMembers.length > 0 && (
        <div className="friend-invite-selected">
          <div className="friend-invite-selected-label">초대된 친구</div>
          <div className="friend-invite-chips">
            {invitedMembers.map((member) => (
              <div key={member.id} className="friend-invite-chip">
                <span className="friend-invite-chip-name">{member.email}</span>
                <button
                  className="friend-invite-chip-remove"
                  onClick={() => handleRemoveInvite(member.id)}
                  aria-label="제거"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="friend-invite-hint">
        * 계획 생성 후에도 친구를 추가하거나 삭제할 수 있습니다.
      </div>
    </div>
  );
}

