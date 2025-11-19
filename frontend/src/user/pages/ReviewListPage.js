// 📁 src/user/pages/ReviewListPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ReviewList from "../components/organisms/ReviewList";
import Button from "../components/atoms/Button";
import PageHeader from "../components/common/PageHeader";
import { getAllReviews, deleteReview } from "../services/reviewService";

import "./ReviewListPage.css";

const ReviewListPage = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 리뷰 목록 불러오기
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const list = await getAllReviews();
      setReviews(Array.isArray(list) ? list : []);
      setError(null);
      console.log("리뷰 목록 로드 완료:", list);
    } catch (err) {
      console.error("리뷰 목록 API 에러:", err?.response?.data || err?.message);
      setError("리뷰 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ✅ 삭제
  const handleDelete = async (review) => {
    if (!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;
    try {
      await deleteReview(review.reviewId);
      await fetchReviews();
    } catch (err) {
      console.error("리뷰 삭제 실패:", err);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  // ✅ 수정 페이지로 이동 (state로 리뷰 데이터 전달)
  const handleEdit = (review) => {
    navigate("/user/review/edit", { state: { review } });
  };

  // ✅ 리뷰 작성 페이지로 이동
  const handleCreate = () => {
    navigate("/user/review/write");
  };

  return (
    <div className="review-list-page">
      <div className="page-header-wrapper">
        <div className="page-header">
          <PageHeader
            title="리뷰 목록"
            subtitle={`총 ${reviews.length}개의 리뷰`}
          />

          {/* 🔥 여기 항상 보이는 버튼 영역 */}
          <div className="page-header-actions">
            <Button variant="primary" onClick={handleCreate}>
              리뷰 작성
            </Button>
          </div>
        </div>
      </div>

      <ReviewList
        reviews={reviews}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={true}
      />
    </div>
  );
};

export default ReviewListPage;
