import React, { useState, useEffect, useMemo } from "react";
import { apiRequest } from "../../../utils/api";
import "./PlanMemberPanel.css";

export default function PlanMemberPanel({ planId }) {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) {
      return;
    }
    fetchMembers();
  }, [planId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        `http://localhost:8080/api/plan/member/${planId}`
      );

      if (!response.ok) {
        throw new Error("함께하는 친구 목록을 불러오는데 실패했습니다.");
      }

      const result = await response.json();
      const data = Array.isArray(result.data) ? result.data : [];

      const confirmedMembers = data.filter((member) => {
        if (typeof member?.isComfirmed === "boolean") {
          return member.isComfirmed;
        }
        if (typeof member?.isConfirmed === "boolean") {
          return member.isConfirmed;
        }
        if (typeof member?.confirmed === "boolean") {
          return member.confirmed;
        }
        return false;
      });

      setMembers(confirmedMembers);
    } catch (error) {
      console.error("PlanMemberPanel fetch error:", error);
      setMembers([]);
      setError(error.message || "친구 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const confirmedCount = useMemo(() => members.length, [members]);

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
          {confirmedCount > 0 && (
            <span className="plan-member-count">{confirmedCount}명</span>
          )}
        </div>

        {error && (
          <div className="plan-member-empty">
            <p>{error}</p>
          </div>
        )}

        {!error && members.length === 0 && (
          <div className="plan-member-empty">
            <p>확정된 친구가 아직 없습니다.</p>
          </div>
        )}

        {!error && members.length > 0 && (
          <div className="plan-member-list">
            {members.map((member, index) => (
              <div key={`${member.memberLoginId}-${index}`} className="plan-member-item">
                <div className="plan-member-info">
                  <div className="plan-member-name-row">
                    <span className="plan-member-name">
                      {member.memberLoginId || "익명 사용자"}
                    </span>
                    <span className="plan-member-role owner">확정</span>
                  </div>
                  <div className="plan-member-email">
                    {member.planTitle || "여행 계획 참여자"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

