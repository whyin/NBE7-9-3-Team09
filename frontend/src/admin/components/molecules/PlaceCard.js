import React from "react";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import "./PlaceCard.css";

const PlaceCard = ({ place, onEdit, onDelete }) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(place);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(place);
    }
  };

  return (
    <Card className="place-card" hoverable>
      <div className="place-header">
        <h3 className="place-name">{place.placeName}</h3>
        <div className="place-actions">
          <Button variant="secondary" size="small" onClick={handleEdit}>
            수정
          </Button>
          <Button variant="danger" size="small" onClick={handleDelete}>
            삭제
          </Button>
        </div>
      </div>

      <div className="place-info">
        <div className="place-address">
          <strong>주소:</strong> {place.address || "주소 정보 없음"}
        </div>
        <div className="place-gu">
          <strong>구:</strong> {place.gu || "구 정보 없음"}
        </div>
        <div className="place-rating">
          <strong>평점:</strong> {place.ratingAvg?.toFixed(2) || "0.0"}
          <span className="rating-count">
            ({place.ratingCount || 0}개 리뷰)
          </span>
        </div>
      </div>

      {place.description && (
        <div className="place-description">
          <strong>설명:</strong>
          <p>{place.description}</p>
        </div>
      )}
    </Card>
  );
};

export default PlaceCard;
