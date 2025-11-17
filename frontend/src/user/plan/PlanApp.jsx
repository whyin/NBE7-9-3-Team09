// src/user/plan/PlanApp.jsx
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import PlanListPage from "./pages/PlanListPage";
import PlanPage from "./pages/PlanPage";
import PlanCreatePage from "./pages/PlanCreatePage";
import PlanDetailPage from "./pages/PlanDetailPage";

// PlanDetailPage를 라우트에서 사용하기 위한 래퍼 컴포넌트
const PlanDetailPageWrapper = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/user/plan/list");
  };

  return <PlanDetailPage planId={planId} onBack={handleBack} />;
};

export default function PlanApp() {
  return (
    <div className="plan-app">
      <Routes>
        {/* index = /user/plan */}
        <Route index element={<PlanPage />} />
        <Route path="create" element={<PlanCreatePage />} />
        <Route path="list" element={<PlanListPage />} />
        <Route path="detail/:planId" element={<PlanDetailPageWrapper />} />
      </Routes>
    </div>
  );
}
