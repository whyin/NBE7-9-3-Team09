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

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const list = await getAllReviews(); // ✅ 배열 반환
      setReviews(Array.isArray(list) ? list : []);
      setError(null);
    } catch (err) {
      console.error(
        "리뷰 목록 API 에러:",
        err?.response?.status,
        err?.response?.data || err?.message
      );
      setError("리뷰 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = () => {
    navigate("/user/review/write");
  };

  const handleEditReview = (review) => {
    navigate("/user/review/edit", { state: { review } });
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await deleteReview(review.reviewId, token);
      alert("리뷰가 성공적으로 삭제되었습니다.");
      fetchReviews();
    } catch (err) {
      console.error(
        "리뷰 삭제 실패:",
        err?.response?.status,
        err?.response?.data || err?.message
      );
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="review-list-page">
      <PageHeader
        title="리뷰 목록"
        subtitle={`총 ${reviews.length}개의 리뷰`}
      />
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 16px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="primary" onClick={handleWriteReview}>
          리뷰 작성하기
        </Button>
      </div>

      {/* ✅ 리뷰 카드 리스트 */}
      <ReviewList
        reviews={reviews}
        loading={loading}
        error={error}
        onEdit={handleEditReview}
        onDelete={handleDeleteReview}
        canEdit={true}
      />
    </div>
  );
};

export default ReviewListPage;
