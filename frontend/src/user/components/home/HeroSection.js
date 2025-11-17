import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <div
      className="hero-section"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      {/* 오버레이 */}
      <div className="hero-overlay"></div>

      {/* 텍스트 컨텐츠 */}
      <div className="hero-content">
        <h1 className="hero-title">당신의 꿈꾸던 여행</h1>
        <p className="hero-subtitle">완벽한 여행지를 찾아보세요</p>
      </div>
    </div>
  );
};

export default HeroSection;
