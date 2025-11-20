import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  getPlacesByCategory,
} from "../../services/categoryService";
import "./RecommendedPlaces.css";

// 카테고리 키를 DB 카테고리 이름으로 매핑
const categoryNameMap = {
  hotel: "HOTEL",
  nightview: "NIGHTSPOT",
  restaurant: "맛집",
};

const RecommendedPlaces = ({ category = "hotel" }) => {
  const navigate = useNavigate();
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendedPlaces();
  }, [category]);

  const fetchRecommendedPlaces = async () => {
    try {
      setLoading(true);
      setError(null);

      // 카테고리 목록 가져오기
      const categoriesResponse = await getCategories();
      const categories = categoriesResponse.data;

      // 카테고리 이름으로 ID 찾기
      const categoryName = categoryNameMap[category] || categoryNameMap.hotel;
      const targetCategory = categories.find(
        (cat) => cat.name === categoryName
      );

      if (!targetCategory) {
        setRecommendedPlaces([]);
        setLoading(false);
        return;
      }

      // 해당 카테고리의 장소 목록 가져오기
      const placesResponse = await getPlacesByCategory(targetCategory.id);

      // 페이지네이션된 응답 구조 처리
      const body = placesResponse.data;
      const pageData = body.data ?? body;
      const content = pageData.content ?? [];

      // 별점순으로 정렬 (높은 별점부터)
      const sortedPlaces = [...content]
        .sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0))
        .slice(0, 3); // 상위 3개만 선택

      setRecommendedPlaces(sortedPlaces);
    } catch (err) {
      console.error("추천 여행지 조회 오류:", err);
      setError("추천 여행지를 불러오는데 실패했습니다.");
      setRecommendedPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (placeName) => {
    navigate(`/user/places?search=${placeName}`);
  };

  if (loading) {
    return (
      <div className="recommended-places">
        <div className="section-header">
          <h2 className="section-title">추천 여행지</h2>
          <p className="section-subtitle">인기 있는 여행지를 둘러보세요</p>
        </div>
        <div className="loading-message">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommended-places">
        <div className="section-header">
          <h2 className="section-title">추천 여행지</h2>
          <p className="section-subtitle">인기 있는 여행지를 둘러보세요</p>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="recommended-places">
      {/* 섹션 헤더 */}
      <div className="section-header">
        <h2 className="section-title">추천 여행지</h2>
        <p className="section-subtitle">인기 있는 여행지를 둘러보세요</p>
      </div>

      {/* 카드 그리드 */}
      <div className="places-grid">
        {recommendedPlaces.length === 0 ? (
          <div className="no-places-message">추천 여행지가 없습니다.</div>
        ) : (
          recommendedPlaces.map((place, index) => (
            <div
              key={place.id}
              onClick={() => handleCardClick(place.placeName || place.name)}
              className="place-card"
            >
              {/* 숫자 표시 영역 */}
              <div className="place-number">
                <span className="number-badge">{index + 1}</span>
              </div>

              {/* 텍스트 영역 */}
              <div className="place-content">
                <h3 className="place-name">{place.placeName || place.name}</h3>
                <p className="place-description">
                  {place.address || place.description || ""}
                </p>
                {place.ratingAvg && (
                  <p className="place-rating">
                    ⭐ {place.ratingAvg.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendedPlaces;
