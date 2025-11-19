import React from "react";
import "./StarRating.css";

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  const handleClick = (star) => {
    if (readOnly || !onRatingChange) return;
    onRatingChange(star);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${rating >= star ? "filled" : ""}`}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
