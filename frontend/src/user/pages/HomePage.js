// 📁 src/user/pages/HomePage.js
import React, { useState } from "react";
import HeroSection from "../components/home/HeroSection";
import SearchBox from "../components/home/SearchBox";
import RecommendedPlaces from "../components/home/RecommendedPlaces";
import MenuCards from "../components/home/MenuCards";
import CategoryTabs from "../components/home/CategoryTabs";
import "./HomePage.css";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("hotel");

  return (
    <div className="home-page">
      <MenuCards />
      <HeroSection />
      <div className="home-page-inner">
        <SearchBox />
        <div style={{ marginTop: "48px" }}>
          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>
      <div className="home-page-recommend">
        <RecommendedPlaces category={selectedCategory} />
      </div>
    </div>
  );
};

export default HomePage;
