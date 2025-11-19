import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import "./planListPage.css";
import { apiRequest } from "../../../utils/api";

// 여행 계획 목록 컴포넌트
function PlanListPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("http://localhost:8080/api/plan/list");

      if (!response.ok) {
        throw new Error("계획 목록을 불러오는데 실패했습니다.");
      }

      const result = await response.json();
      setPlans(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateContent = (content, maxLength = 30) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const handleHomeClick = () => {
    navigate("/user");
  };

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
          <button onClick={fetchPlans} className="retry-button">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="여행 계획 목록"
        subtitle={`총 ${plans.length}개의 여행 계획`}
        onBack={handleHomeClick}
      />
      <div className="content">
        {plans.length === 0 ? (
          <div className="empty-box">
            <p className="empty-text">아직 등록된 여행 계획이 없습니다.</p>
          </div>
        ) : (
          <div className="grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => navigate(`/user/plan/detail/${plan.id}`)}
                className="card"
              >
                <div className="card-content">
                  <div className="card-section">
                    <h3 className="card-label">제목</h3>
                    <p className="card-title">{plan.title}</p>
                  </div>

                  <div className="card-section">
                    <h3 className="card-label">내용</h3>
                    <p className="card-text">
                      {truncateContent(plan.content, 30)}
                    </p>
                  </div>

                  <div className="card-section">
                    <h3 className="card-label">기간</h3>
                    <p className="card-date">
                      {formatDateTime(plan.startDate)} ~{" "}
                      {formatDateTime(plan.endDate)}
                    </p>
                  </div>
                </div>
                <div className="card-border"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 여행 계획 상세 컴포넌트
function PlanDetailPage({ planId, onBack }) {
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
    { value: "bookmark", label: "내 북마크" },
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
          method: "PATCH",
          body: JSON.stringify(editData),
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
        planId: planId,
        placeId: parseInt(editingDetailData.placeId),
        startTime: editingDetailData.startTime,
        endTime: editingDetailData.endTime,
        title: editingDetailData.title,
        content: editingDetailData.content,
      };

      const response = await apiRequest(
        `http://localhost:8080/api/plan/detail/update/${detailId}`,
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

      let response;

      if (category === "") {
        return;
      }

      if (category === "bookmark") {
        // 북마크 목록 가져오기
        response = await apiRequest("http://localhost:8080/api/bookmarks");
      } else {
        // 추천 여행지 가져오기
        response = await apiRequest(
          `http://localhost:8080/api/review/recommend/${encodeURIComponent(
            category
          )}`
        );
      }

      if (!response.ok) {
        throw new Error("목록을 불러오는데 실패했습니다.");
      }

      const result = await response.json();

      // 북마크 데이터를 추천 여행지 형식으로 변환
      if (category === "bookmark") {
        const bookmarkData = (result.data || []).map((bookmark) => ({
          id: bookmark.placeId,
          placeName: bookmark.placeName,
          address: bookmark.address,
          averageRating: 0, // 북마크는 평점이 없으므로 0으로 설정
        }));
        setRecommendedPlaces(bookmarkData);
      } else {
        setRecommendedPlaces(result.data || []);
      }

      setShowPlaceList(true);
    } catch (err) {
      alert(err.message);
      setRecommendedPlaces([]);
    } finally {
      setLoadingPlaces(false);
    }
  };

  const fetchEditRecommendedPlaces = async (category) => {
    if (!category || category === "카테고리 선택") {
      console.warn("유효하지 않은 카테고리 선택:", category);
      setEditShowPlaceList(false); // 리스트 숨김 처리
      return; // API 호출 안 함
    }

    try {
      setEditLoadingPlaces(true);

      let response;
      if (category === "bookmark") {
        // 북마크 목록 가져오기
        response = await apiRequest("http://localhost:8080/api/bookmarks");
      } else {
        // 추천 여행지 가져오기
        response = await apiRequest(
          `http://localhost:8080/api/review/recommend/${encodeURIComponent(
            category
          )}`
        );
      }

      if (!response.ok) {
        throw new Error("목록을 불러오는데 실패했습니다.");
      }

      const result = await response.json();

      // 북마크 데이터를 추천 여행지 형식으로 변환
      if (category === "bookmark") {
        const bookmarkData = (result.data || []).map((bookmark) => ({
          id: bookmark.placeId,
          placeName: bookmark.placeName,
          address: bookmark.address,
          averageRating: 0, // 북마크는 평점이 없으므로 0으로 설정
        }));

        // ✅ 북마크 데이터가 비었을 경우 경고창 표시
        if (!bookmarkData || bookmarkData.length === 0) {
          alert("저장된 북마크가 없습니다.");
          setEditRecommendedPlaces([]); // 비워두기
          setEditShowPlaceList(false); // 리스트 숨김 처리
          return; // 이후 로직 중단
        }

        setEditRecommendedPlaces(bookmarkData);
      } else {
        setEditRecommendedPlaces(result.data || []);
      }

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

  return (
    <div className="container">
      <div className="detail-content">
        <button onClick={onBack} className="back-button">
          ← 목록으로
        </button>

        <div className="detail-box">
          <div className="detail-header">
            <h1 className="detail-title">여행 계획 상세</h1>
            {!isEditing ? (
              <div className="button-group">
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-button"
                >
                  수정
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="delete-button"
                >
                  삭제
                </button>
              </div>
            ) : (
              <div className="button-group">
                <button onClick={handleUpdate} className="save-button">
                  수정하기
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
                  className="cancel-button"
                >
                  취소
                </button>
              </div>
            )}
          </div>

          <div className="form-container">
            <div className="form-group">
              <h3 className="form-label">제목</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="input"
                />
              ) : (
                <p className="form-value">{plan.title}</p>
              )}
            </div>

            <div className="form-group">
              <h3 className="form-label">내용</h3>
              {isEditing ? (
                <textarea
                  value={editData.content}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                  rows="6"
                  className="textarea"
                />
              ) : (
                <p className="form-value-content">{plan.content}</p>
              )}
            </div>

            <div className="form-group">
              <h3 className="form-label">기간</h3>
              {isEditing ? (
                <div className="date-range-container">
                  <input
                    type="datetime-local"
                    value={editData.startDate}
                    onChange={(e) =>
                      setEditData({ ...editData, startDate: e.target.value })
                    }
                    className="date-input"
                  />
                  <span className="date-separator">~</span>
                  <input
                    type="datetime-local"
                    value={editData.endDate}
                    onChange={(e) =>
                      setEditData({ ...editData, endDate: e.target.value })
                    }
                    className="date-input"
                  />
                </div>
              ) : (
                <p className="form-value">
                  {formatDateTime(plan.startDate)} ~{" "}
                  {formatDateTime(plan.endDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="detail-box">
          <div className="detail-list-header">
            <h2 className="section-title">여행 상세 일정</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="add-button"
            >
              {showAddForm ? "취소" : "계획 상세 추가하기"}
            </button>
          </div>

          {showAddForm && (
            <div className="add-form-container">
              <h3 className="add-form-title">새 상세 일정 추가</h3>

              <div className="form-group">
                <label className="form-label">카테고리 선택</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="input"
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {loadingPlaces && (
                <div className="loading-places">
                  <p>추천 여행지를 불러오는 중...</p>
                </div>
              )}

              {showPlaceList && recommendedPlaces.length > 0 && (
                <div className="form-group">
                  <label className="form-label">
                    {selectedCategory === "bookmark"
                      ? "내 북마크 목록"
                      : "추천 여행지 선택"}
                  </label>
                  <div className="place-list">
                    {recommendedPlaces.map((place) => (
                      <div
                        key={place.id}
                        onClick={() => handlePlaceSelect(place)}
                        className={`place-item ${
                          newDetail.placeId === place.id ? "selected" : ""
                        }`}
                      >
                        <div className="place-item-main">
                          {selectedCategory !== "bookmark" && (
                            <span className="place-rating">
                              [⭐ {place.averageRating.toFixed(2)}]
                            </span>
                          )}
                          <span className="place-name">{place.placeName}</span>
                        </div>
                        <div className="place-address">{place.address}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newDetail.placeName && (
                <div className="form-group">
                  <label className="form-label">선택된 장소</label>
                  <div className="selected-place-info">
                    <strong>{newDetail.placeName}</strong>
                    <span className="place-id-badge">
                      ID: {newDetail.placeId}
                    </span>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">시작 시간</label>
                <input
                  type="datetime-local"
                  value={newDetail.startTime}
                  onChange={(e) =>
                    setNewDetail({ ...newDetail, startTime: e.target.value })
                  }
                  className="input"
                />
                {newDetail.startTime && !isTimeInRange(newDetail.startTime) && (
                  <p className="warning-text">
                    시작 시간은 계획 기간 내에 있어야 합니다.
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">종료 시간</label>
                <input
                  type="datetime-local"
                  value={newDetail.endTime}
                  onChange={(e) =>
                    setNewDetail({ ...newDetail, endTime: e.target.value })
                  }
                  className="input"
                />
                {newDetail.endTime && !isTimeInRange(newDetail.endTime) && (
                  <p className="warning-text">
                    종료 시간은 계획 기간 내에 있어야 합니다.
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">제목</label>
                <input
                  type="text"
                  value={newDetail.title}
                  onChange={(e) =>
                    setNewDetail({ ...newDetail, title: e.target.value })
                  }
                  className="input"
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div className="form-group">
                <label className="form-label">내용</label>
                <textarea
                  value={newDetail.content}
                  onChange={(e) =>
                    setNewDetail({ ...newDetail, content: e.target.value })
                  }
                  rows="4"
                  className="textarea"
                  placeholder="내용을 입력하세요"
                />
              </div>

              <button
                onClick={handleAddDetail}
                disabled={!isAddFormValid()}
                className="save-button"
                style={{
                  opacity: !isAddFormValid() ? 0.5 : 1,
                  cursor: !isAddFormValid() ? "not-allowed" : "pointer",
                }}
              >
                저장
              </button>
            </div>
          )}

          {planDetails.length === 0 ? (
            <div className="empty-detail-box">
              <p className="empty-text">아직 등록된 상세 일정이 없습니다.</p>
            </div>
          ) : (
            <div className="detail-list">
              {planDetails.map((detail) => (
                <div key={detail.id} className="detail-item">
                  {editingDetailId === detail.id ? (
                    <div>
                      <div className="detail-item-edit-header">
                        <h3 className="detail-item-title">상세 일정 수정</h3>
                        <div className="button-group">
                          <button
                            onClick={() => handleUpdateDetail(detail.id)}
                            className="save-button"
                          >
                            저장
                          </button>
                          <button
                            onClick={handleCancelEditDetail}
                            className="cancel-button"
                          >
                            취소
                          </button>
                        </div>
                      </div>

                      <div className="form-container">
                        <div className="form-group">
                          <label className="form-label">카테고리 선택</label>
                          <select
                            value={editSelectedCategory}
                            onChange={(e) =>
                              handleEditCategorySelect(e.target.value)
                            }
                            className="input"
                          >
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {editLoadingPlaces && (
                          <div className="loading-places">
                            <p>추천 여행지를 불러오는 중...</p>
                          </div>
                        )}

                        {editShowPlaceList &&
                          editRecommendedPlaces.length > 0 && (
                            <div className="form-group">
                              <label className="form-label">
                                {editSelectedCategory === "bookmark"
                                  ? "내 북마크 목록"
                                  : "추천 여행지 선택"}
                              </label>
                              <div className="place-list">
                                {editRecommendedPlaces.map((place) => (
                                  <div
                                    key={place.id}
                                    onClick={() => handleEditPlaceSelect(place)}
                                    className={`place-item ${
                                      editingDetailData.placeId === place.id
                                        ? "selected"
                                        : ""
                                    }`}
                                  >
                                    <div className="place-item-main">
                                      {editSelectedCategory !== "bookmark" && (
                                        <span className="place-rating">
                                          [⭐ {place.averageRating.toFixed(2)}]
                                        </span>
                                      )}
                                      <span className="place-name">
                                        {place.placeName}
                                      </span>
                                    </div>
                                    <div className="place-address">
                                      {place.address}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {editingDetailData.placeName && (
                          <div className="form-group">
                            <label className="form-label">선택된 장소</label>
                            <div className="selected-place-info">
                              <strong>{editingDetailData.placeName}</strong>
                              <span className="place-id-badge">
                                ID: {editingDetailData.placeId}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="form-group">
                          <label className="form-label">시작 시간</label>
                          <input
                            type="datetime-local"
                            value={editingDetailData.startTime}
                            onChange={(e) =>
                              setEditingDetailData({
                                ...editingDetailData,
                                startTime: e.target.value,
                              })
                            }
                            className="input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">종료 시간</label>
                          <input
                            type="datetime-local"
                            value={editingDetailData.endTime}
                            onChange={(e) =>
                              setEditingDetailData({
                                ...editingDetailData,
                                endTime: e.target.value,
                              })
                            }
                            className="input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">제목</label>
                          <input
                            type="text"
                            value={editingDetailData.title}
                            onChange={(e) =>
                              setEditingDetailData({
                                ...editingDetailData,
                                title: e.target.value,
                              })
                            }
                            className="input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">내용</label>
                          <textarea
                            value={editingDetailData.content}
                            onChange={(e) =>
                              setEditingDetailData({
                                ...editingDetailData,
                                content: e.target.value,
                              })
                            }
                            rows="4"
                            className="textarea"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="detail-item-header">
                        <div>
                          <h3 className="detail-item-title">{detail.title}</h3>
                          <div className="detail-item-place">
                            📍 {detail.placeName}
                          </div>
                        </div>
                        <div className="button-group">
                          <button
                            onClick={() => handleEditDetail(detail)}
                            className="edit-small-button"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteDetail(detail.id)}
                            className="delete-small-button"
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <p className="detail-item-content">{detail.content}</p>

                      <div className="detail-item-time">
                        🕐 {formatDetailDateTime(detail.startTime)} ~{" "}
                        {formatDetailDateTime(detail.endTime)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
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

// PlanListPage를 직접 export
export default PlanListPage;
