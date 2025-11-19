// 📁 src/user/components/organisms/ReviewForm.js

import React, { useState, useEffect } from "react";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import StarRating from "../atoms/StarRating";
import { getAllPlaces } from "../../services/placeService";

const ReviewForm = ({
  initialData = null,
  isEditing = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    placeId: initialData?.placeId || "",
    placeName: initialData?.placeName || "",
    category: initialData?.category || "",
    address: initialData?.address || "",
    gu: initialData?.gu || "",
    rating: initialData?.rating || 0,
    content: initialData?.content || "",
    reviewId: initialData?.reviewId || initialData?.id || null,
  });

  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  // 여행지 목록 불러오기
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setLoadingPlaces(true);
        const res = await getAllPlaces();
        const list = Array.isArray(res) ? res : res?.data || [];
        setPlaces(list);
      } catch (e) {
        console.error("장소 목록 불러오기 실패:", e);
        setError("여행지 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoadingPlaces(false);
      }
    };

    loadPlaces();
  }, []);

  const handlePlaceChange = (e) => {
    const selectedId = Number(e.target.value);
    const selected = places.find((p) => p.id === selectedId);

    if (selected) {
      setFormData((prev) => ({
        ...prev,
        placeId: selected.id,
        placeName: selected.placeName ?? "",
        category: selected.category ?? "",
        address: selected.address ?? "",
        gu: selected.gu ?? "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, placeId: selectedId }));
    }
    if (error) setError("");
  };

  const handleRatingChange = (value) => {
    setFormData((prev) => ({ ...prev, rating: value }));
    if (error) setError("");
  };

  const handleChangeContent = (e) => {
    setFormData((prev) => ({ ...prev, content: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.placeId && !isEditing) {
      setError("여행지를 선택해주세요.");
      return;
    }
    if (!formData.rating || formData.rating <= 0) {
      setError("평점을 선택해주세요.");
      return;
    }

    const submitData = {
      placeId: formData.placeId,
      rating: formData.rating,
      placeName: formData.placeName,
      category: formData.category,
      address: formData.address,
      gu: formData.gu,
      content: formData.content,
      reviewId: formData.reviewId,
    };

    onSubmit(submitData);
  };

  // 공통 스타일 헬퍼
  const fieldWrapperStyle = {
    marginBottom: 16,
    textAlign: "left",
  };

  const labelStyle = {
    display: "block",
    marginBottom: 6,
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#374151",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: "0.9rem",
    boxSizing: "border-box",
    color: "#111827",
    backgroundColor: "#ffffff",
    outline: "none",
  };

  return (
    <Card>
      <div
        style={{
          maxWidth: 600,
          margin: "40px auto",
          padding: 24,
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
          border: "1px solid #fee2e2",
        }}
      >
        {/* 헤더 */}
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {isEditing ? "리뷰 수정" : "리뷰 작성"}
          </h3>
          {formData.placeName && (
            <p
              style={{
                marginTop: 8,
                fontSize: "0.9rem",
                color: "#6b7280",
              }}
            >
              {formData.placeName}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* 여행지 선택 (작성일 때만) */}
          {!isEditing && (
            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>여행지 선택</label>
              <select
                name="placeId"
                value={formData.placeId}
                onChange={handlePlaceChange}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  backgroundColor: "#f9fafb",
                }}
                required
              >
                <option value="">여행지를 선택하세요</option>
                {places.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.placeName} ({place.category}) - {place.address}
                  </option>
                ))}
              </select>
              {loadingPlaces && (
                <div
                  style={{
                    marginTop: 6,
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                  }}
                >
                  여행지 목록을 불러오는 중...
                </div>
              )}
            </div>
          )}

          {/* 카테고리 */}
          <div style={fieldWrapperStyle}>
            <label style={labelStyle}>카테고리</label>
            <input
              type="text"
              value={formData.category}
              readOnly
              style={{ ...inputStyle, backgroundColor: "#f9fafb" }}
            />
          </div>

          {/* 주소 */}
          <div style={fieldWrapperStyle}>
            <label style={labelStyle}>주소</label>
            <input
              type="text"
              value={formData.address}
              readOnly
              style={{ ...inputStyle, backgroundColor: "#f9fafb" }}
            />
          </div>

          {/* 구 */}
          <div style={fieldWrapperStyle}>
            <label style={labelStyle}>구</label>
            <input
              type="text"
              value={formData.gu}
              readOnly
              style={{ ...inputStyle, backgroundColor: "#f9fafb" }}
            />
          </div>

          {/* 평점 */}
          <div style={fieldWrapperStyle}>
            <label style={labelStyle}>평점</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <StarRating
                rating={formData.rating}
                onRatingChange={handleRatingChange}
                size="large"
              />
              <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                {formData.rating > 0
                  ? `${formData.rating}/5`
                  : "평점을 선택해주세요"}
              </span>
            </div>
          </div>

          {/* 한 줄 코멘트 */}
          <div style={fieldWrapperStyle}>
            <label style={labelStyle}>한 줄 코멘트</label>
            <input
              type="text"
              value={formData.content}
              onChange={handleChangeContent}
              placeholder="리뷰 한 줄을 입력하세요"
              style={inputStyle}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div
              style={{
                marginTop: 8,
                marginBottom: 16,
                padding: "8px 10px",
                borderRadius: 8,
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          {/* 버튼 영역 */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" variant="primary">
              {isEditing ? "수정하기" : "리뷰 작성"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ReviewForm;
