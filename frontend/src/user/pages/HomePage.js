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
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <MenuCards />
      <HeroSection />
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 16px",
          marginTop: "-80px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <SearchBox />
        <div style={{ marginTop: "48px" }}>
          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 16px 16px 16px",
          marginTop: "-8px",
        }}
      >
        <RecommendedPlaces category={selectedCategory} />
      </div>
    </div>
  );
};

export default HomePage;
