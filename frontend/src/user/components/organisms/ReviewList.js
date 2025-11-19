// 📁 src/user/components/organisms/ReviewList.js
import React from "react";
import ReviewCard from "../molecules/ReviewCard";
import "./ReviewList.css";

const ReviewList = ({ reviews, loading, error, onEdit, onDelete, canEdit }) => {
  if (loading) {
    return <div className="review-list-message">리뷰를 불러오는 중입니다...</div>;
  }

  if (error) {
    return (
      <div className="review-list-message review-list-error">
        {error}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="review-list-message">
        등록된 리뷰가 없습니다.
      </div>
    );
  }

  return (
    <div className="review-list-grid">
      {reviews.map((review) => (
        <ReviewCard
          key={review.reviewId ?? review.id}
          review={review}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
};

export default ReviewList;
