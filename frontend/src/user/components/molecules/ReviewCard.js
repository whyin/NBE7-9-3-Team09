// 📁 src/user/components/molecules/ReviewCard.js
import React from "react";

// CSS 파일은 옵션 – 지금은 인라인 스타일로 충분해서 사용 안 함
// import "./ReviewCard.css";

const ReviewCard = ({ review, onEdit, onDelete, canEdit }) => {
  if (!review) return null;

  console.log("ReviewCard 렌더링:", review);

  // ✅ 안전한 별점 처리
  const rating = Number(review.rating) || 0;
  const stars =
    "★".repeat(Math.min(5, rating)) +
    "☆".repeat(Math.max(0, 5 - rating));

  // ✅ 날짜 처리 (가능한 모든 필드 체크)
  const rawDate =
    review.modifiedDate ||
    review.updatedAt ||
    review.createdAt ||
    review.modify_date;

  let formattedDate = "";
  if (rawDate) {
    try {
      formattedDate = new Date(rawDate).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.warn("리뷰 날짜 파싱 실패:", rawDate, e);
    }
  }

  return (
    <div
      className="review-card"
      style={{
        // 🔧 그리드 한 칸을 꽉 채우도록
        width: "100%",
        boxSizing: "border-box",
        // 외부 여백은 grid gap으로 처리하니까 margin 제거
        margin: 0,

        border: "1px solid #e5e7eb",
        background: "#ffffff",
        padding: "14px 16px",
        minHeight: "120px",
        display: "block",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
        position: "relative",
        zIndex: 1,
        textAlign: "left",
      }}
    >
      {/* 상단: 장소 이름 + 카테고리 + 별점 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "6px",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{
              fontSize: "1.0rem",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {review.placeName || "이름 없는 여행지"}
          </div>

          <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            {review.category && (
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  background: "#eef2ff",
                  color: "#4f46e5",
                  fontWeight: 500,
                  marginRight: "6px",
                }}
              >
                {review.category}
              </span>
            )}
            {review.gu && <span>{review.gu}</span>}
          </div>
        </div>

        {/* 별점 */}
        <div
          style={{
            textAlign: "right",
            minWidth: "80px",
          }}
        >
          <div
            style={{
              color: "#f59e0b",
              fontSize: "0.9rem",
              marginBottom: "2px",
            }}
          >
            {stars}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#4b5563",
            }}
          >
            {rating ? `${rating}점` : "평점 없음"}
          </div>
        </div>
      </div>

      {/* 주소 + 내용 */}
      {(review.address || review.content) && (
        <div style={{ fontSize: "0.85rem", color: "#374151" }}>
          {review.address && (
            <div
              style={{
                marginBottom: review.content ? "4px" : 0,
                lineHeight: 1.4,
              }}
            >
              {review.address}
            </div>
          )}
          {review.content && (
            <div
              style={{
                marginTop: "2px",
                lineHeight: 1.4,
                whiteSpace: "pre-line",
              }}
            >
              {review.content}
            </div>
          )}
        </div>
      )}

      {/* 하단: 날짜 + 버튼 */}
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "#9ca3af",
        }}
      >
        <span>{formattedDate && `작성일: ${formattedDate}`}</span>

        {canEdit && (
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => onEdit(review)}
              style={{
                padding: "4px 10px",
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              수정
            </button>
            <button
              onClick={() => onDelete(review)}
              style={{
                padding: "4px 10px",
                borderRadius: "999px",
                border: "none",
                background: "#fecaca",
                color: "#b91c1c",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
