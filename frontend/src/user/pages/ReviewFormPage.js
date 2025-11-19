// 📁 src/user/pages/ReviewFormPage.js

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReviewForm from "../components/organisms/ReviewForm";
import { createReview, modifyReview } from "../services/reviewService";
import "./ReviewFormPage.css";

const ReviewFormPage = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 수정일 때만 location.state에서 review 가져옴
  const review = isEdit ? location.state?.review : null;

  const handleSubmit = async (formData) => {
    try {
      if (isEdit) {
        // ✅ 수정
        await modifyReview(formData.reviewId, formData.rating, formData.content);
        alert("리뷰가 수정되었습니다.");
      } else {
        // ✅ 생성
        await createReview({
          placeId: formData.placeId,
          rating: formData.rating,
          content: formData.content,
        });
        alert("리뷰가 등록되었습니다.");
      }
      navigate("/user/review/list");
    } catch (err) {
      console.error("리뷰 저장 실패:", err);
      alert("리뷰 저장에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/user/review/list");
  };

  return (
    <div className="review-form-page">
      <ReviewForm
        initialData={review}
        isEditing={isEdit}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ReviewFormPage;
