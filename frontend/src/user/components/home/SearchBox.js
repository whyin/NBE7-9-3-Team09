import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBox.css";

const SearchBox = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const popularDistricts = ["강남구", "종로구", "마포구", "용산구", "송파구"];

  const handleCreatePlan = () => {
    // 시작일과 종료일이 모두 선택된 경우에만 계획 작성 페이지로 이동
    if (startDate && endDate) {
      navigate(`/user/plan/create?start=${startDate}&end=${endDate}`);
    } else {
      // 날짜가 선택되지 않은 경우에도 계획 작성 페이지로 이동 (선택사항)
      const params = new URLSearchParams();
      if (startDate) params.append("start", startDate);
      if (endDate) params.append("end", endDate);
      navigate(
        `/user/plan/create${params.toString() ? `?${params.toString()}` : ""}`
      );
    }
  };

  const handlePopularClick = (district) => {
    // 인기 지역 클릭 시 해당 지역으로 검색 (기존 기능 유지)
    navigate(`/user/places?search=${district}`);
  };

  return (
    <div className="search-box">
      {/* 안내 문구 */}
      <p className="search-box-hint">
        여행 기간을 선택하고 계획 작성을 시작해보세요.
      </p>

      {/* 날짜 입력 영역 */}
      <div className="search-inputs">
        {/* 시작 날짜 입력 */}
        <div className="input-wrapper">
          <div className="input-icon">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="search-input"
            placeholder="시작 날짜"
          />
        </div>

        {/* 종료 날짜 입력 */}
        <div className="input-wrapper">
          <div className="input-icon">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="search-input"
            placeholder="종료 날짜"
            min={startDate || undefined}
          />
        </div>

        {/* 계획 작성 버튼 */}
        <button onClick={handleCreatePlan} className="search-button">
          계획 작성
        </button>
      </div>

      {/* 서울 인기 지역 태그 */}
      <div className="popular-tags">
        <span className="tags-label">서울 인기 지역:</span>
        {popularDistricts.map((district) => (
          <button
            key={district}
            onClick={() => handlePopularClick(district)}
            className="tag-button"
          >
            {district}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBox;
