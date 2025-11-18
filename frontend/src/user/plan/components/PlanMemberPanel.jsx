import React, { useState, useEffect } from "react";
import {
  getPlanMembers,
  removeMemberFromPlan,
  leavePlan,
  getCurrentUser,
} from "../../services/friendService";
import FriendInviteModal from "./FriendInviteModal";
import "./PlanMemberPanel.css";

export default function PlanMemberPanel({ planId, onMemberChange }) {
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchCurrentUser();
  }, [planId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const membersList = await getPlanMembers(planId);
      setMembers(membersList);
      
      // 현재 사용자 정보와 비교하여 방장 여부 확인
      if (currentUser && membersList.length > 0) {
        const owner = membersList.find((m) => m.role === "OWNER" || m.isOwner);
        setIsOwner(owner && owner.id === currentUser.id);
      }
    } catch (error) {
      console.error("참여자 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
    }
  };

  useEffect(() => {
    if (currentUser && members.length > 0) {
      const owner = members.find((m) => m.role === "OWNER" || m.isOwner);
      setIsOwner(owner && owner.id === currentUser.id);
    }
  }, [currentUser, members]);

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("정말로 이 친구를 계획에서 제거하시겠습니까?")) {
      return;
    }

    try {
      await removeMemberFromPlan(planId, memberId);
      await fetchMembers();
      if (onMemberChange) {
        onMemberChange();
      }
      alert("친구가 제거되었습니다.");
    } catch (error) {
      alert("친구 제거에 실패했습니다.");
    }
  };

  const handleLeavePlan = async () => {
    if (!window.confirm("정말로 이 계획에서 나가시겠습니까?")) {
      return;
    }

    try {
      await leavePlan(planId);
      alert("계획에서 나갔습니다.");
      window.location.href = "/user/plan/list";
    } catch (error) {
      alert("계획 나가기에 실패했습니다.");
    }
  };

  const handleInviteSuccess = () => {
    fetchMembers();
    if (onMemberChange) {
      onMemberChange();
    }
  };

  const getAvatarInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const getRoleBadge = (member) => {
    const isOwnerMember = member.role === "OWNER" || member.isOwner;
    return isOwnerMember ? "방장" : "참여자";
  };

  if (loading) {
    return (
      <div className="plan-member-panel">
        <div className="plan-member-loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <>
      <div className="plan-member-panel">
        <div className="plan-member-header">
          <h3 className="plan-member-title">👥 함께하는 친구</h3>
          {members.length > 0 && (
            <span className="plan-member-count">{members.length}명</span>
          )}
        </div>

        {members.length === 0 ? (
          <div className="plan-member-empty">
            <p>아직 함께하는 친구가 없습니다.</p>
          </div>
        ) : (
          <div className="plan-member-list">
            {members.map((member) => {
              const isCurrentUser = currentUser && member.id === currentUser.id;
              const isOwnerMember = member.role === "OWNER" || member.isOwner;

              return (
                <div key={member.id} className="plan-member-item">
                  <div className="plan-member-avatar">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={member.nickname}
                        className="plan-member-avatar-img"
                      />
                    ) : (
                      <span className="plan-member-avatar-initial">
                        {getAvatarInitial(member.nickname)}
                      </span>
                    )}
                  </div>
                  <div className="plan-member-info">
                    <div className="plan-member-name-row">
                      <span className="plan-member-name">{member.nickname}</span>
                      <span
                        className={`plan-member-role ${
                          isOwnerMember ? "owner" : "member"
                        }`}
                      >
                        {getRoleBadge(member)}
                      </span>
                    </div>
                    <div className="plan-member-email">{member.email}</div>
                  </div>
                  <div className="plan-member-actions">
                    {isOwner && !isCurrentUser && (
                      <button
                        className="plan-member-remove-btn"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        삭제
                      </button>
                    )}
                    {!isOwner && isCurrentUser && (
                      <button
                        className="plan-member-leave-btn"
                        onClick={handleLeavePlan}
                      >
                        나가기
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isOwner && (
          <button
            className="plan-member-invite-btn"
            onClick={() => setShowInviteModal(true)}
          >
            + 친구 초대
          </button>
        )}
      </div>

      {showInviteModal && (
        <FriendInviteModal
          planId={planId}
          onClose={() => setShowInviteModal(false)}
          onSuccess={handleInviteSuccess}
        />
      )}
    </>
  );
}

