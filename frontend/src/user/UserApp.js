import React from "react";
import { Routes, Route } from "react-router-dom";
import "./UserApp.css";
import PlanApp from "./plan/PlanApp";
import PlacesApp from "./places/PlacesApp";
import MemberApp from "./member/MemberApp";
import BookmarkApp from "./bookmark/BookmarkApp";
import ReviewApp from "./pages/ReviewApp";
import HomePage from "./pages/HomePage";

const UserApp = () => {
  return (
    <div className="user-app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="plan/*" element={<PlanApp />} />
        <Route path="places/*" element={<PlacesApp />} />
        <Route path="review/*" element={<ReviewApp />} />
        <Route path="bookmark/*" element={<BookmarkApp />} />
        <Route path="member/*" element={<MemberApp />} />
      </Routes>
    </div>
  );
};

export default UserApp;
