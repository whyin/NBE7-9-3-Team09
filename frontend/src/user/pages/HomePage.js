import React, { useState } from "react";
import HeroSection from "../components/home/HeroSection";
import SearchBox from "../components/home/SearchBox";
import RecommendedPlaces from "../components/home/RecommendedPlaces";
import CategoryTabs from "../components/home/CategoryTabs";
import "./HomePage.css";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("hotel");

  return (
    <div className="home-page">
      <HeroSection />
      <div className="home-page__search-panel">
        <SearchBox />
        <div className="home-page__category-tabs">
          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>
      <div className="home-page__recommendation">
        <RecommendedPlaces category={selectedCategory} />
      </div>
    </div>
  );
};

export default HomePage;
