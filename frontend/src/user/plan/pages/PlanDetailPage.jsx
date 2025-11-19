import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../../components/common/PageHeader";
import "./planListPage.css";
import "./PlanDetailPage.css";
import { apiRequest } from "../../../utils/api";
import { getCategoryIcon, getCategoryInfo } from "../../utils/categoryUtils";
import PlanMemberPanel from "../components/PlanMemberPanel";
import PlanSummaryCard from "../components/PlanSummaryCard";
import PlanScheduleSection from "../components/PlanScheduleSection";

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
    { value: "HOTEL", label: "숙박" },
    { value: "RESTAURANT", label: "음식점" },
    { value: "NIGHTSPOT", label: "나이트스팟" },
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
      fetchPlanDetail();
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
          method: "PUT",
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
    <div className="plan-detail-page">
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
      <div className="plan-detail-three-column">
        {/* 왼쪽 컬럼: 요약 카드 */}
        <div className="plan-detail-column plan-detail-column-left">
          <PlanSummaryCard
            plan={plan}
            isEditing={isEditing}
            editData={editData}
            onEditChange={setEditData}
            onEdit={() => setIsEditing(true)}
            onSave={handleUpdate}
            onCancel={() => {
              setIsEditing(false);
              setEditData({
                title: plan.title,
                content: plan.content,
                startDate: plan.startDate,
                endDate: plan.endDate,
              });
            }}
            onDelete={() => setShowDeleteConfirm(true)}
          />
        </div>

        {/* 가운데 컬럼: 여행 상세 일정 */}
        <div className="plan-detail-column plan-detail-column-center">
          <PlanScheduleSection
            planDetails={sortedPlanDetails}
            plan={plan}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            recommendedPlaces={recommendedPlaces}
            showPlaceList={showPlaceList}
            loadingPlaces={loadingPlaces}
            newDetail={newDetail}
            onNewDetailChange={setNewDetail}
            onPlaceSelect={handlePlaceSelect}
            showAddForm={showAddForm}
            onToggleAddForm={() => setShowAddForm(!showAddForm)}
            onAddDetail={handleAddDetail}
            isAddFormValid={isAddFormValid}
            editingDetailId={editingDetailId}
            editingDetailData={editingDetailData}
            onEditingDetailChange={setEditingDetailData}
            editSelectedCategory={editSelectedCategory}
            onEditCategorySelect={handleEditCategorySelect}
            editRecommendedPlaces={editRecommendedPlaces}
            editShowPlaceList={editShowPlaceList}
            editLoadingPlaces={editLoadingPlaces}
            onEditPlaceSelect={handleEditPlaceSelect}
            onEditDetail={handleEditDetail}
            onUpdateDetail={handleUpdateDetail}
            onCancelEditDetail={handleCancelEditDetail}
            onDeleteDetail={handleDeleteDetail}
            getDetailCategory={getDetailCategory}
          />
        </div>

        {/* 오른쪽 컬럼: 함께하는 친구 */}
        <div className="plan-detail-column plan-detail-column-right">
          <PlanMemberPanel
            planId={planId}
            onMemberChange={fetchPlanDetailsList}
          />
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
