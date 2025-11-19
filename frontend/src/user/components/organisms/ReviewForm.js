// 📁 src/user/components/organisms/ReviewForm.js

import React, { useState, useEffect } from "react";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import StarRating from "../atoms/StarRating";
import { getAllPlaces } from "../../services/placeService";
// ❌ CSS import 제거 (inline 스타일로만 처리)
// import "./ReviewForm.css";

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
    content: initialData?.content || "", // ⭐ 한 줄 코멘트
    reviewId: initialData?.reviewId || initialData?.id || null,
  });

  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const [loadingPlaces, setLoadingPlaces] = useState(false);

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

  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "24px 16px",
      }}
    >
      <Card
        style={{
          width: "100%",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          padding: "24px 20px",
          boxSizing: "border-box",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: "6px",
              fontSize: "20px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {isEditing ? "리뷰 수정" : "리뷰 작성"}
          </h3>
          {formData.placeName && (
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              {formData.placeName}
            </p>
          )}
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* 여행지 선택 (작성일 때만) */}
          {!isEditing && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                여행지 선택
              </label>
              <select
                name="placeId"
                value={formData.placeId}
                onChange={handlePlaceChange}
                required
                style={{
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  outline: "none",
                }}
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
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  여행지 목록을 불러오는 중...
                </div>
              )}
            </div>
          )}

          {/* 카테고리 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#374151",
              }}
            >
              카테고리
            </label>
            <input
              type="text"
              value={formData.category}
              readOnly
              style={{
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                backgroundColor: "#f9fafb",
              }}
            />
          </div>

          {/* 주소 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#374151",
              }}
            >
              주소
            </label>
            <input
              type="text"
              value={formData.address}
              readOnly
              style={{
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                backgroundColor: "#f9fafb",
              }}
            />
          </div>

          {/* 구 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#374151",
              }}
            >
              구
            </label>
            <input
              type="text"
              value={formData.gu}
              readOnly
              style={{
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                backgroundColor: "#f9fafb",
              }}
            />
          </div>

          {/* 평점 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#374151",
              }}
            >
              평점
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <StarRating
                rating={formData.rating}
                onRatingChange={handleRatingChange}
                size="large"
              />
              <span
                style={{
                  fontSize: "14px",
                  color: "#4b5563",
                }}
              >
                {formData.rating > 0
                  ? `${formData.rating}/5`
                  : "평점을 선택해주세요"}
              </span>
            </div>
          </div>

          {/* ⭐ 한 줄 코멘트 입력 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#374151",
              }}
            >
              한 줄 코멘트
            </label>
            <input
              type="text"
              value={formData.content}
              onChange={handleChangeContent}
              placeholder="리뷰 한 줄을 입력하세요"
              style={{
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div
              style={{
                marginTop: "4px",
                padding: "8px 10px",
                borderRadius: "6px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                fontSize: "13px",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          {/* 버튼 영역 */}
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
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
      </Card>
    </div>
  );
};

export default ReviewForm;
