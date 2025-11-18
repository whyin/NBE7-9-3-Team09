import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../utils/api";
import PageHeader from "../../components/common/PageHeader";
import { getCategoryIcon, getCategoryInfo } from "../../utils/categoryUtils";
import "./PlanPage.css";

export default function TravelPlanMain() {
  const navigate = useNavigate();
  const [todayPlan, setTodayPlan] = useState(null);
  const [planDetails, setPlanDetails] = useState([]);
  const [allTodayDetails, setAllTodayDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvitedPlans, setShowInvitedPlans] = useState(false);
  const [rawInvitedPlans, setRawInvitedPlans] = useState([]);
  const [invitedLoading, setInvitedLoading] = useState(false);
  const [invitedError, setInvitedError] = useState(null);
  const [activeInvitationId, setActiveInvitationId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchTodayPlan();
    fetchCurrentUser();
  }, []);

  // 날짜가 오늘인지 확인
  const isToday = (dateTimeString) => {
    if (!dateTimeString) return false;
    const date = new Date(dateTimeString);
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const fetchTodayPlan = async () => {
    try {
      setLoading(true);
      const planResponse = await apiRequest(
        "http://localhost:8080/api/plan/todayPlan"
      );
      if (!planResponse.ok) {
        if (planResponse.status === 404) {
          setTodayPlan(null);
          setPlanDetails([]);
          setAllTodayDetails([]);
          setLoading(false);
          return;
        }
        throw new Error("여행 계획을 불러오는데 실패했습니다.");
      }

      const planData = await planResponse.json();
      setTodayPlan(planData);

      // 오늘 날짜에 해당하는 모든 세부 일정 가져오기
      const planId = planData.data?.id;
      if (planId) {
        try {
          const detailResponse = await apiRequest(
            `http://localhost:8080/api/plan/detail/${planId}/list`
          );
          if (detailResponse.ok) {
            const detailResult = await detailResponse.json();
            const allDetails = detailResult.data || [];

            // 오늘 날짜에 해당하는 일정만 필터링
            const todayDetails = allDetails.filter((detail) =>
              isToday(detail.startTime)
            );

            setPlanDetails(allDetails);
            setAllTodayDetails(todayDetails);
          } else {
            setPlanDetails([]);
            setAllTodayDetails([]);
          }
        } catch (detailErr) {
          console.error("세부 일정 조회 실패:", detailErr);
          setPlanDetails([]);
          setAllTodayDetails([]);
        }
      } else {
        setPlanDetails([]);
        setAllTodayDetails([]);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("ko-KR", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 카테고리 정보는 공통 유틸 함수 사용 (getCategoryInfo from categoryUtils)

  // 세부 일정에서 카테고리 추출
  const getDetailCategory = (detail) => {
    // detail 객체에서 category 필드 확인
    if (detail.category) {
      return detail.category;
    }
    // placeCategory 필드 확인
    if (detail.placeCategory) {
      return detail.placeCategory;
    }
    // place의 categoryName 필드 확인
    if (detail.place && detail.place.categoryName) {
      return detail.place.categoryName;
    }
    // placeName에서 추정 (예: 호텔, 맛집 등이 이름에 포함된 경우)
    if (detail.placeName) {
      const placeName = detail.placeName.toLowerCase();
      if (placeName.includes("호텔") || placeName.includes("hotel")) {
        return "HOTEL";
      }
      if (
        placeName.includes("맛집") ||
        placeName.includes("식당") ||
        placeName.includes("restaurant") ||
        placeName.includes("food")
      ) {
        return "맛집";
      }
      if (
        placeName.includes("야경") ||
        placeName.includes("night") ||
        placeName.includes("view")
      ) {
        return "NIGHTSPOT";
      }
    }
    // 기본값
    return null;
  };

  // 오늘의 세부 일정을 시간순으로 정렬
  const sortedTodayDetails = useMemo(() => {
    return [...allTodayDetails].sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeA - timeB;
    });
  }, [allTodayDetails]);

  const handleCreatePlan = () => {
    console.log("handleCreatePlan called");
    navigate("/user/plan/create");
  };

  const handleViewPlans = () => {
    console.log("handleViewPlans called");
    navigate("/user/plan/list");
  };

  const handleToggleInvitedPlans = () => {
    const nextState = !showInvitedPlans;
    setShowInvitedPlans(nextState);
    if (nextState) {
      fetchInvitedPlans();
    } else {
      setActiveInvitationId(null);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await apiRequest("http://localhost:8080/api/members/me", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("사용자 정보를 불러오지 못했습니다.");
      }
      const result = await response.json();
      const memberId =
        result.data?.id ||
        result.data?.memberId ||
        result.data?.memberLoginId ||
        result.data?.loginId;
      setCurrentUserId(memberId || null);
    } catch (err) {
      console.error("Failed to load current user:", err);
      setCurrentUserId(null);
    }
  };

  const fetchInvitedPlans = async () => {
    try {
      setInvitedLoading(true);
      setInvitedError(null);
      const response = await apiRequest(
        "http://localhost:8080/api/plan/member/mylist"
      );

      if (!response.ok) {
        throw new Error("초대받은 계획을 불러오지 못했습니다.");
      }

      const result = await response.json();
      setRawInvitedPlans(result.data || []);
    } catch (err) {
      console.error("Failed to load invited plans:", err);
      setInvitedError(err.message || "초대받은 계획 조회 중 오류가 발생했습니다.");
      setRawInvitedPlans([]);
    } finally {
      setInvitedLoading(false);
    }
  };

  const invitedPlans = useMemo(() => {
    if (!currentUserId) return rawInvitedPlans;
    return rawInvitedPlans.filter(
      (plan) => plan.planMemberId !== currentUserId
    );
  }, [rawInvitedPlans, currentUserId]);

  const getInvitationStatus = (statusValue) => {
    if (statusValue === 1) return { label: "승낙 완료", className: "accepted" };
    if (statusValue === -1) return { label: "거절됨", className: "denied" };
    return { label: "대기 중", className: "pending" };
  };

  const handleSelectInvitation = (planMemberId) => {
    setActiveInvitationId((prev) =>
      prev === planMemberId ? null : planMemberId
    );
  };

  const handleInvitationResponse = async (invitation, action) => {
    const endpoint =
      action === "accept"
        ? "http://localhost:8080/api/plan/member/accept"
        : "http://localhost:8080/api/plan/member/deny";

    const memberId =
      invitation.memberLoginId ?? invitation.memberId ?? invitation.memberID;

    if (!memberId) {
      alert("초대 응답을 처리할 회원 정보를 찾을 수 없습니다.");
      return;
    }

    const payload = {
      planMemberId: invitation.planMemberId,
      memberId,
      planId: invitation.planId,
    };

    try {
      const response = await apiRequest(endpoint, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("초대 응답 처리에 실패했습니다.");
      }

      const actionText = action === "accept" ? "승낙" : "거절";
      alert(`초대를 ${actionText}했습니다.`);
      await fetchInvitedPlans();
    } catch (err) {
      console.error("Failed to handle invitation:", err);
      alert(err.message || "초대 응답 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="main">
      <PageHeader
        title="나의 여행 계획"
        subtitle="즐거운 여행을 계획하고 관리하세요"
      />
      <div className="main-container">
        <div className="button-group">
          <button className="primary" onClick={handleCreatePlan}>
            여행계획 작성하기
          </button>
          <button className="secondary" onClick={handleViewPlans}>
            여행계획 목록보기
          </button>
          <button className="secondary" onClick={handleToggleInvitedPlans}>
            초대받은 계획 조회
          </button>
        </div>

        {showInvitedPlans && (
          <div className="invited-plans-panel">
            <div className="invited-plans-header">
              <h3>📨 초대받은 계획</h3>
              <div className="invited-actions">
                <button className="refresh-btn" onClick={fetchInvitedPlans}>
                  새로고침
                </button>
                <button
                  className="close-panel-btn"
                  onClick={() => {
                    setShowInvitedPlans(false);
                    setActiveInvitationId(null);
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
            {invitedLoading ? (
              <div className="invited-plans-loading">불러오는 중...</div>
            ) : invitedError ? (
              <div className="invited-plans-error">{invitedError}</div>
            ) : invitedPlans.length === 0 ? (
              <div className="invited-plans-empty">
                아직 초대받은 계획이 없습니다.
              </div>
            ) : (
              <div className="invited-plan-list">
                {invitedPlans.map((plan) => {
                  const status = getInvitationStatus(plan.isAccepted);
                  const isActive = activeInvitationId === plan.planMemberId;
                  return (
                    <div
                      key={plan.planMemberId}
                      className={`invited-plan-item ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() => handleSelectInvitation(plan.planMemberId)}
                    >
                      <div className="invited-plan-info">
                        <div>
                          <p className="invited-plan-title">{plan.planTitle}</p>
                          {plan.isAccepted === 0 && (
                            <p className="invited-plan-meta">
                              초대 응답을 기다리고 있습니다.
                            </p>
                          )}
                        </div>
                        <span
                          className={`invited-plan-status ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      {isActive && (
                        <div className="invited-plan-actions">
                          <button
                            className="accept-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInvitationResponse(plan, "accept");
                            }}
                            disabled={plan.isAccepted === 1}
                          >
                            승낙
                          </button>
                          <button
                            className="deny-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInvitationResponse(plan, "deny");
                            }}
                            disabled={plan.isAccepted === -1}
                          >
                            거절
                          </button>
                          <button
                            className="view-plan-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/user/plan/detail/${plan.planId}`);
                            }}
                            disabled={plan.isAccepted !== 1}
                          >
                            계획 보기
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="plan-card">
          <h2>📅 오늘의 여행 계획</h2>

          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <p>로딩 중...</p>
            </div>
          ) : error ? (
            <div className="error">
              <p>{error}</p>
              <button onClick={fetchTodayPlan} className="retry">
                다시 시도
              </button>
            </div>
          ) : !todayPlan ? (
            <div className="empty">
              <div className="emoji">📅</div>
              <p className="main-text">오늘 예정된 여행 계획이 없습니다</p>
              <p className="sub-text">새로운 여행을 계획해보세요!</p>
            </div>
          ) : (
            <div>
              <div className="today-card">
                <h3>{todayPlan.data.title}</h3>
                {todayPlan.data.content && (
                  <p className="content">{todayPlan.data.content}</p>
                )}
                <div className="date">
                  <span>📅 {formatDate(todayPlan.data.startDate)}</span>
                  <span> ~ </span>
                  <span>{formatDate(todayPlan.data.endDate)}</span>
                </div>
              </div>

              {/* 오늘의 세부 일정 */}
              {sortedTodayDetails.length > 0 ? (
                <div className="details">
                  <h4>📋 오늘의 일정 ({sortedTodayDetails.length}개)</h4>
                  <div className="today-details-list">
                    {sortedTodayDetails.map((detail) => {
                      const category = getDetailCategory(detail);
                      const categoryInfo = getCategoryInfo(category);
                      return (
                        <div
                          key={detail.id}
                          className="detail-card today-detail-item"
                          onClick={() =>
                            navigate(`/user/plan/detail/${todayPlan.data.id}`)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <div className="detail-header">
                            <div className="detail-title-row">
                              <span className="category-icon">
                                {categoryInfo.icon}
                              </span>
                              <h5>{detail.title}</h5>
                            </div>
                            <span className="time">
                              🕐 {formatTime(detail.startTime)} -{" "}
                              {formatTime(detail.endTime)}
                            </span>
                          </div>
                          {detail.placeName && (
                            <div className="place">
                              📍 <span>{detail.placeName}</span>
                            </div>
                          )}
                          {detail.content && (
                            <p className="detail-content">{detail.content}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="no-details">
                  <p>오늘 예정된 세부 일정이 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
