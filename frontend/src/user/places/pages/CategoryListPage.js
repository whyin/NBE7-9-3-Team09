import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  getPlaceCountByCategory,
} from "../../services/categoryService";
import "./CategoryListPage.css";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();

      const categoriesWithIcons = await Promise.all(
        response.data.map(async (category) => {
          const placeCount = await getPlaceCountByCategory(category.id);
          return {
            ...category,
            description: getCategoryDescription(category.name),
            icon: getCategoryIcon(category.name),
            placeCount: placeCount,
          };
        })
      );

      setCategories(categoriesWithIcons);
      setError(null);
    } catch (err) {
      console.error("카테고리 목록 조회 오류:", err);
      setError("카테고리 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDescription = (categoryName) => {
    const descriptions = {
      관광지: "서울의 대표적인 관광 명소들을 만나보세요",
      맛집: "서울의 맛있는 음식점들을 추천드려요",
      NIGHTSPOT: "서울의 야경 명소들을 감상해보세요",
      HOTEL: "편안한 숙박을 위한 호텔 정보를 확인하세요",
    };
    return descriptions[categoryName] || "다양한 여행지를 만나보세요";
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      관광지: "🏛️",
      맛집: "🍽️",
      NIGHTSPOT: "🌃",
      HOTEL: "🏨",
    };
    return icons[categoryName] || "📍";
  };

  const getCategoryDisplayName = (categoryName) => {
    const nameMap = {
      NIGHTSPOT: "야경명소",
      맛집: "맛집",
    };
    return nameMap[categoryName] || categoryName;
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/user/places/category/${categoryId}`);
  };

  if (loading) return <div className="loading">카테고리를 불러오는 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="category-list-page">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate("/user")}>
          ← 뒤로가기
        </button>
        <div className="header-content">
          <h1>서울 여행지</h1>
          <p>카테고리를 선택하여 여행지를 둘러보세요</p>
        </div>
      </header>

      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-title">
              {getCategoryDisplayName(category.name)}
            </h3>
            <p className="category-description">{category.description}</p>
            <div className="category-count">
              {category.placeCount}개의 여행지
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryListPage;
