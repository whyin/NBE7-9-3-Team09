import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../../components/common/PageHeader";
import "./planListPage.css";
import "./PlanDetailPage.css";
import { apiRequest } from "../../../utils/api";
import { getCategoryIcon, getCategoryInfo } from "../../utils/categoryUtils";

// 여행 계획 상세 컴포넌트
export default function PlanDetailPage({ planId, onBack }) {
  const [plan, setPlan] = useState(null);
  const [planDetails, setPlanDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [editingDetailData, setEditingDetailData] = useState({});

  const [editData, setEditData] = useState({
    title: "",
    content: "",
    startDate: "",
    endDate: "",
  });

  const [newDetail, setNewDetail] = useState({
    placeId: "",
    placeName: "",
    startTime: "",
    endTime: "",
    title: "",
    content: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [showPlaceList, setShowPlaceList] = useState(false);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  const [editSelectedCategory, setEditSelectedCategory] = useState("");
  const [editRecommendedPlaces, setEditRecommendedPlaces] = useState([]);
  const [editShowPlaceList, setEditShowPlaceList] = useState(false);
  const [editLoadingPlaces, setEditLoadingPlaces] = useState(false);

  const categories = [
    { value: "hotel", label: "숙박" },
    { value: "restaurant", label: "음식점" },
    { value: "nightspot", label: "나이트스팟" },
  ];

  useEffect(() => {
    fetchPlanDetail();
    fetchPlanDetailsList();
  }, [planId]);

  const fetchPlanDetail = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(
        `http://localhost:8080/api/plan/${planId}`
      );

      if (!response.ok) {
        throw new Error("계획 상세를 불러오는데 실패했습니다.");
      }

      const result = await response.json();
      const data = result.data;
      setPlan(data);
      setEditData({
        title: data.title,
        content: data.content,
        startDate: data.startDate,
        endDate: data.endDate,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanDetailsList = async () => {
    try {
      const response = await apiRequest(
        `http://localhost:8080/api/plan/detail/${planId}/list`
      );

      if (!response.ok) {
        throw new Error("상세 목록을 불러오는데 실패했습니다.");
      }

      const result = await response.json();
      setPlanDetails(result.data || []);
    } catch (err) {
      console.error("상세 목록 불러오기 실패:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await apiRequest(
        `http://localhost:8080/api/plan/update/${planId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("수정에 실패했습니다.");
      }

      const result = await response.json();
      setPlan(result.data);
      setIsEditing(false);
      alert("수정이 완료되었습니다.");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiRequest(
        `http://localhost:8080/api/plan/delete/${planId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("삭제에 실패했습니다.");
      }

      alert("삭제가 완료되었습니다.");
      onBack();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddDetail = async () => {
    try {
      const requestBody = {
        planId: planId,
        placeId: parseInt(newDetail.placeId),
        startTime: newDetail.startTime,
        endTime: newDetail.endTime,
        title: newDetail.title,
        content: newDetail.content,
      };

      const response = await apiRequest(
        "http://localhost:8080/api/plan/detail/add",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("상세 일정 추가에 실패했습니다.");
      }

      alert("상세 일정이 추가되었습니다.");
      setShowAddForm(false);
      setNewDetail({
        placeId: "",
        placeName: "",
        startTime: "",
        endTime: "",
        title: "",
        content: "",
      });
      setSelectedCategory("");
      setRecommendedPlaces([]);
      setShowPlaceList(false);
      fetchPlanDetailsList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditDetail = (detail) => {
    setEditingDetailId(detail.id);
    setEditingDetailData({
      placeId: detail.placeId,
      placeName: detail.placeName,
      startTime: detail.startTime,
      endTime: detail.endTime,
      title: detail.title,
      content: detail.content,
    });
  };

  const handleUpdateDetail = async (detailId) => {
    try {
      const requestBody = {
        placeId: parseInt(editingDetailData.placeId),
        startTime: editingDetailData.startTime,
        endTime: editingDetailData.endTime,
        title: editingDetailData.title,
        content: editingDetailData.content,
      };

      const response = await apiRequest(
        `http://localhost:8080/api/plan/detail/${detailId}/update`,
        {
          method: "PATCH",
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("상세 일정 수정에 실패했습니다.");
      }

      alert("상세 일정이 수정되었습니다.");
      setEditingDetailId(null);
      setEditingDetailData({});
      setEditSelectedCategory("");
      setEditRecommendedPlaces([]);
      setEditShowPlaceList(false);
      fetchPlanDetailsList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteDetail = async (detailId) => {
    if (!window.confirm("이 상세 일정을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await apiRequest(
        `http://localhost:8080/api/plan/detail/delete/${detailId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("상세 일정 삭제에 실패했습니다.");
      }

      alert("상세 일정이 삭제되었습니다.");
      fetchPlanDetailsList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelEditDetail = () => {
    setEditingDetailId(null);
    setEditingDetailData({});
    setEditSelectedCategory("");
    setEditRecommendedPlaces([]);
    setEditShowPlaceList(false);
  };

  const fetchRecommendedPlaces = async (category) => {
    try {
      setLoadingPlaces(true);
      const response = await apiRequest(
        `http://localhost:8080/api/review/recommend/${encodeURIComponent(
          category
        )}`
      );

      if (!response.ok) {
        throw new Error("추천 여행지를 불러오는데 실패했습니다.");
      }

      const result = await response.json();
      setRecommendedPlaces(result.data || []);
      setShowPlaceList(true);
    } catch (err) {
      alert(err.message);
      setRecommendedPlaces([]);
    } finally {
      setLoadingPlaces(false);
    }
  };

  const fetchEditRecommendedPlaces = async (category) => {
    try {
      setEditLoadingPlaces(true);
      const response = await apiRequest(
        `http://localhost:8080/api/review/recommend/${encodeURIComponent(
          category
        )}`
      );

      if (!response.ok) {
        throw new Error("추천 여행지를 불러오는데 실패했습니다.");
      }

      const result = await response.json();
      setEditRecommendedPlaces(result.data || []);
      setEditShowPlaceList(true);
    } catch (err) {
      alert(err.message);
      setEditRecommendedPlaces([]);
    } finally {
      setEditLoadingPlaces(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchRecommendedPlaces(category);
  };

  const handleEditCategorySelect = (category) => {
    setEditSelectedCategory(category);
    fetchEditRecommendedPlaces(category);
  };

  const handlePlaceSelect = (place) => {
    setNewDetail({
      ...newDetail,
      placeId: place.id,
      placeName: place.placeName,
    });
    setShowPlaceList(false);
  };

  const handleEditPlaceSelect = (place) => {
    setEditingDetailData({
      ...editingDetailData,
      placeId: place.id,
      placeName: place.placeName,
    });
    setEditShowPlaceList(false);
  };

  const isAddFormValid = () => {
    if (
      !newDetail.placeId ||
      !newDetail.startTime ||
      !newDetail.endTime ||
      !newDetail.title ||
      !newDetail.content
    ) {
      return false;
    }
    return (
      isTimeInRange(newDetail.startTime) && isTimeInRange(newDetail.endTime)
    );
  };

  const isTimeInRange = (time) => {
    if (!plan || !time) return true;
    const timeDate = new Date(time);
    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.endDate);
    return timeDate >= startDate && timeDate <= endDate;
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDetailDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateForSubtitle = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  // 시간순으로 정렬된 상세 일정 (모든 hooks는 early return 전에 호출되어야 함)
  const sortedPlanDetails = useMemo(() => {
    return [...planDetails].sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeA - timeB;
    });
  }, [planDetails]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <div className="error-box">
          <p className="error-text">{error}</p>
          <button onClick={onBack} className="retry-button">
            목록으로
          </button>
        </div>
      </div>
    );
  }

  // 상세 일정의 카테고리 찾기
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
    // placeName에서 추정
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

  return (
    <div className="container">
      <PageHeader
        title={plan ? plan.title : "여행 계획 상세"}
        subtitle={
          plan && plan.startDate && plan.endDate
            ? `${formatDateForSubtitle(
                plan.startDate
              )} ~ ${formatDateForSubtitle(plan.endDate)}`
            : ""
        }
        onBack={onBack}
        backText="← 목록으로"
      />
      <div className="plan-detail-layout">
        {/* 좌측: 여행 계획 기본 정보 */}
        <div className="plan-info-sidebar">
          <div className="plan-info-card">
            <div className="plan-info-header">
              {!isEditing ? (
                <>
                  <h2 className="plan-info-title">{plan.title}</h2>
                  <div className="plan-info-actions">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="plan-info-edit-btn"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="plan-info-delete-btn"
                    >
                      삭제
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="plan-info-title">계획 수정</h2>
                  <div className="plan-info-actions">
                    <button
                      onClick={handleUpdate}
                      className="plan-info-save-btn"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          title: plan.title,
                          content: plan.content,
                          startDate: plan.startDate,
                          endDate: plan.endDate,
                        });
                      }}
                      className="plan-info-cancel-btn"
                    >
                      취소
                    </button>
                  </div>
                </>
              )}
            </div>

            {!isEditing ? (
              <>
                <div className="plan-info-date">
                  {formatDateTime(plan.startDate)} ~{" "}
                  {formatDateTime(plan.endDate)}
                </div>
                {plan.content && (
                  <p className="plan-info-content">{plan.content}</p>
                )}
              </>
            ) : (
              <div className="plan-info-edit-form">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  placeholder="계획 제목"
                />
                <textarea
                  value={editData.content}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                  placeholder="계획 설명"
                />
                <input
                  type="datetime-local"
                  value={editData.startDate}
                  onChange={(e) =>
                    setEditData({ ...editData, startDate: e.target.value })
                  }
                />
                <input
                  type="datetime-local"
                  value={editData.endDate}
                  onChange={(e) =>
                    setEditData({ ...editData, endDate: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* 우측: 상세 일정 영역 */}
        <div className="plan-details-main">
          {/* 상세 일정 추가 폼 */}
          <div className="detail-add-form-card">
            <div className="detail-add-form-header">
              <h2 className="detail-add-form-title">여행 상세 일정</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`detail-add-form-toggle ${
                  showAddForm ? "cancel" : ""
                }`}
              >
                {showAddForm ? "취소" : "+ 새 일정 추가"}
              </button>
            </div>

            {showAddForm && (
              <div className="detail-add-form-content">
                <div className="detail-add-form-group">
                  <label className="detail-add-form-label">카테고리</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="detail-add-form-select"
                  >
                    <option value="">카테고리 선택</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {loadingPlaces && (
                  <div className="detail-add-form-group full-width">
                    <p>추천 여행지를 불러오는 중...</p>
                  </div>
                )}

                {showPlaceList && recommendedPlaces.length > 0 && (
                  <div className="detail-add-form-group full-width">
                    <label className="detail-add-form-label">추천 여행지</label>
                    <div className="place-selection-list">
                      {recommendedPlaces.map((place) => (
                        <div
                          key={place.id}
                          onClick={() => handlePlaceSelect(place)}
                          className={`place-selection-item ${
                            newDetail.placeId === place.id ? "selected" : ""
                          }`}
                        >
                          <div className="place-selection-item-name">
                            ⭐ {place.averageRating.toFixed(1)}{" "}
                            {place.placeName}
                          </div>
                          <div className="place-selection-item-address">
                            {place.address}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {newDetail.placeName && (
                  <div className="detail-add-form-group full-width">
                    <label className="detail-add-form-label">선택된 장소</label>
                    <div
                      style={{
                        padding: "8px",
                        background: "#f3f4f6",
                        borderRadius: "8px",
                      }}
                    >
                      <strong>{newDetail.placeName}</strong>
                    </div>
                  </div>
                )}

                <div className="detail-add-form-group">
                  <label className="detail-add-form-label">시작 시간</label>
                  <input
                    type="datetime-local"
                    value={newDetail.startTime}
                    onChange={(e) =>
                      setNewDetail({ ...newDetail, startTime: e.target.value })
                    }
                    className="detail-add-form-input"
                  />
                  {newDetail.startTime &&
                    !isTimeInRange(newDetail.startTime) && (
                      <p
                        style={{
                          color: "#ef4444",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        시작 시간은 계획 기간 내에 있어야 합니다.
                      </p>
                    )}
                </div>

                <div className="detail-add-form-group">
                  <label className="detail-add-form-label">종료 시간</label>
                  <input
                    type="datetime-local"
                    value={newDetail.endTime}
                    onChange={(e) =>
                      setNewDetail({ ...newDetail, endTime: e.target.value })
                    }
                    className="detail-add-form-input"
                  />
                  {newDetail.endTime && !isTimeInRange(newDetail.endTime) && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      종료 시간은 계획 기간 내에 있어야 합니다.
                    </p>
                  )}
                </div>

                <div className="detail-add-form-group">
                  <label className="detail-add-form-label">제목</label>
                  <input
                    type="text"
                    value={newDetail.title}
                    onChange={(e) =>
                      setNewDetail({ ...newDetail, title: e.target.value })
                    }
                    className="detail-add-form-input"
                    placeholder="일정 제목"
                  />
                </div>

                <div className="detail-add-form-group full-width">
                  <label className="detail-add-form-label">내용</label>
                  <textarea
                    value={newDetail.content}
                    onChange={(e) =>
                      setNewDetail({ ...newDetail, content: e.target.value })
                    }
                    className="detail-add-form-textarea"
                    placeholder="일정 설명"
                  />
                </div>

                <button
                  onClick={handleAddDetail}
                  disabled={!isAddFormValid()}
                  className="detail-add-form-submit"
                >
                  저장
                </button>
              </div>
            )}
          </div>

          {/* 상세 일정 타임라인 */}
          {sortedPlanDetails.length === 0 ? (
            <div className="detail-timeline-empty">
              <div className="detail-timeline-empty-icon">📅</div>
              <p className="detail-timeline-empty-text">
                아직 등록된 상세 일정이 없습니다.
              </p>
            </div>
          ) : (
            <div className="detail-timeline">
              {sortedPlanDetails.map((detail) => {
                const category = getDetailCategory(detail);
                const categoryInfo = getCategoryInfo(category);
                return (
                  <div
                    key={detail.id}
                    className={`detail-timeline-item ${categoryInfo.class} ${
                      editingDetailId === detail.id ? "editing" : ""
                    }`}
                  >
                    {editingDetailId === detail.id ? (
                      <div className="detail-timeline-edit-form">
                        <div className="detail-timeline-edit-form-group">
                          <label className="detail-timeline-edit-form-label">
                            카테고리
                          </label>
                          <select
                            value={editSelectedCategory}
                            onChange={(e) =>
                              handleEditCategorySelect(e.target.value)
                            }
                            className="detail-timeline-edit-form-input"
                          >
                            <option value="">카테고리 선택</option>
                            {categories.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {editLoadingPlaces && (
                          <div className="detail-timeline-edit-form-group full-width">
                            <p>추천 여행지를 불러오는 중...</p>
                          </div>
                        )}

                        {editShowPlaceList &&
                          editRecommendedPlaces.length > 0 && (
                            <div className="detail-timeline-edit-form-group full-width">
                              <label className="detail-timeline-edit-form-label">
                                추천 여행지
                              </label>
                              <div className="place-selection-list">
                                {editRecommendedPlaces.map((place) => (
                                  <div
                                    key={place.id}
                                    onClick={() => handleEditPlaceSelect(place)}
                                    className={`place-selection-item ${
                                      editingDetailData.placeId === place.id
                                        ? "selected"
                                        : ""
                                    }`}
                                  >
                                    <div className="place-selection-item-name">
                                      ⭐ {place.averageRating.toFixed(1)}{" "}
                                      {place.placeName}
                                    </div>
                                    <div className="place-selection-item-address">
                                      {place.address}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {editingDetailData.placeName && (
                          <div className="detail-timeline-edit-form-group full-width">
                            <label className="detail-timeline-edit-form-label">
                              선택된 장소
                            </label>
                            <div
                              style={{
                                padding: "8px",
                                background: "#f3f4f6",
                                borderRadius: "8px",
                              }}
                            >
                              <strong>{editingDetailData.placeName}</strong>
                            </div>
                          </div>
                        )}

                        <div className="detail-timeline-edit-form-group">
                          <label className="detail-timeline-edit-form-label">
                            시작 시간
                          </label>
                          <input
                            type="datetime-local"
                            value={editingDetailData.startTime}
                            onChange={(e) =>
                              setEditingDetailData({
                                ...editingDetailData,
                                startTime: e.target.value,
                              })
                            }
                            className="detail-timeline-edit-form-input"
                          />
                        </div>

                        <div className="detail-timeline-edit-form-group">
                          <label className="detail-timeline-edit-form-label">
                            종료 시간
                          </label>
                          <input
                            type="datetime-local"
                            value={editingDetailData.endTime}
                            onChange={(e) =>
                              setEditingDetailData({
                                ...editingDetailData,
                                endTime: e.target.value,
                              })
                            }
                            className="detail-timeline-edit-form-input"
                          />
                        </div>

                        <div className="detail-timeline-edit-form-group">
                          <label className="detail-timeline-edit-form-label">
                            제목
                          </label>
                          <input
                            type="text"
                            value={editingDetailData.title}
                            onChange={(e) =>
                              setEditingDetailData({
                                ...editingDetailData,
                                title: e.target.value,
                              })
                            }
                            className="detail-timeline-edit-form-input"
                          />
                        </div>

                        <div className="detail-timeline-edit-form-group full-width">
                          <label className="detail-timeline-edit-form-label">
                            내용
                          </label>
                          <textarea
                            value={editingDetailData.content}
                            onChange={(e) =>
                              setEditingDetailData({
                                ...editingDetailData,
                                content: e.target.value,
                              })
                            }
                            className="detail-timeline-edit-form-textarea"
                          />
                        </div>

                        <div className="detail-timeline-edit-actions">
                          <button
                            onClick={() => handleUpdateDetail(detail.id)}
                            className="detail-timeline-edit-save-btn"
                          >
                            저장
                          </button>
                          <button
                            onClick={handleCancelEditDetail}
                            className="detail-timeline-edit-cancel-btn"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="detail-timeline-icon">
                          {getCategoryIcon(category)}
                        </div>
                        <div className="detail-timeline-content">
                          <div className="detail-timeline-header">
                            <div>
                              <h3 className="detail-timeline-title">
                                {detail.title}
                              </h3>
                              <div className="detail-timeline-time">
                                🕐 {formatDetailDateTime(detail.startTime)} ~{" "}
                                {formatDetailDateTime(detail.endTime)}
                              </div>
                              <div className="detail-timeline-place">
                                📍 {detail.placeName}
                              </div>
                            </div>
                            <div className="detail-timeline-actions">
                              <button
                                onClick={() => handleEditDetail(detail)}
                                className="detail-timeline-edit-btn"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleDeleteDetail(detail.id)}
                                className="detail-timeline-delete-btn"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                          {detail.content && (
                            <p className="detail-timeline-description">
                              {detail.content}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="modal-title">삭제 확인</h3>
            <p className="modal-text">
              정말로 이 여행 계획을 삭제하시겠습니까?
            </p>
            <div className="modal-buttons">
              <button onClick={handleDelete} className="confirm-delete-button">
                삭제
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="cancel-button"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
