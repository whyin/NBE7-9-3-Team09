import { Routes, Route, Navigate } from "react-router-dom";
import ReviewListPage from "./ReviewListPage";
import ReviewFormPage from "./ReviewFormPage";
import "./ReviewApp.css";

function ReviewApp() {
  return (
    <div className="review-app">
      <Routes>
        {/* ✅ 기본 /user/review 경로일 때 list로 리다이렉트 */}
        <Route path="/" element={<Navigate to="list" replace />} />

        <Route path="list" element={<ReviewListPage />} />
        <Route path="write" element={<ReviewFormPage />} />
        <Route path="edit" element={<ReviewFormPage isEdit={true} />} />
      </Routes>
    </div>
  );
}

export default ReviewApp;
