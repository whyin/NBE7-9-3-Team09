// 📁 src/user/components/organisms/ReviewForm.js

import React, { useState, useEffect } from "react";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import StarRating from "../atoms/StarRating";
import { getAllPlaces } from "../../services/placeService";
import "./ReviewForm.css";

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
    <Card className="review-form-container">
      <div className="review-form-header">
        <h3>{isEditing ? "리뷰 수정" : "리뷰 작성"}</h3>
        {formData.placeName && (
          <p className="place-name">{formData.placeName}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        {/* 여행지 선택 (작성일 때만) */}
        {!isEditing && (
          <div className="form-group">
            <label className="form-label">여행지 선택</label>
            <select
              name="placeId"
              value={formData.placeId}
              onChange={handlePlaceChange}
              className="form-input"
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
              <div className="loading-text">여행지 목록을 불러오는 중...</div>
            )}
          </div>
        )}

        {/* 카테고리 */}
        <div className="form-group">
          <label className="form-label">카테고리</label>
          <input
            type="text"
            value={formData.category}
            className="form-input"
            readOnly
          />
        </div>

        {/* 주소 */}
        <div className="form-group">
          <label className="form-label">주소</label>
          <input
            type="text"
            value={formData.address}
            className="form-input"
            readOnly
          />
        </div>

        {/* 구 */}
        <div className="form-group">
          <label className="form-label">구</label>
          <input
            type="text"
            value={formData.gu}
            className="form-input"
            readOnly
          />
        </div>

        {/* 평점 */}
        <div className="form-group">
          <label className="form-label">평점</label>
          <div className="rating-container">
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              size="large"
            />
            <span className="rating-text">
              {formData.rating > 0
                ? `${formData.rating}/5`
                : "평점을 선택해주세요"}
            </span>
          </div>
        </div>

        {/* ⭐ 한 줄 코멘트 입력 */}
        <div className="form-group">
          <label className="form-label">한 줄 코멘트</label>
          <input
            type="text"
            value={formData.content}
            onChange={handleChangeContent}
            className="form-input"
            placeholder="리뷰 한 줄을 입력하세요"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? "수정하기" : "리뷰 작성"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReviewForm;
