import api from "./api";

// 리뷰 등록
export const createReview = async (reviewData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.post("/api/review/add", reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("리뷰 등록 실패:", error);
    throw error;
  }
};

export const modifyReview = async (reviewId, rating, content) => {
  try {
    const token = localStorage.getItem("accessToken");

    // 쿼리 파라미터 구성 (백엔드 @RequestParam 이름과 동일하게)
    const params = new URLSearchParams({
      modifyRating: rating,
      modifyContent: content ?? "",
    }).toString();

    const response = await api.patch(
      `/api/review/modify/${reviewId}?${params}`,
      null, // body는 필요 없으니 null/{} 아무거나
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("리뷰 수정 실패:", error);
    throw error;
  }
};

// 리뷰 삭제
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/api/review/delete/${reviewId}`);
    return response;
  } catch (error) {
    console.error("리뷰 삭제 실패:", error);
    throw error;
  }
};

// 내가 작성한 리뷰 조회
export const getMyReview = async (reviewId) => {
  try {
    const response = await api.get(`/api/review/${reviewId}`);
    return response;
  } catch (error) {
    console.error("내 리뷰 조회 실패:", error);
    throw error;
  }
};

// 특정 여행지의 리뷰 조회
export const getPlaceReviews = async (placeId) => {
  try {
    const response = await api.get(`/api/review/list/${placeId}`);
    return response;
  } catch (error) {
    console.error("여행지 리뷰 조회 실패:", error);
    throw error;
  }
};

export const getAllReviews = async () => {
  const response = await api.get("/api/review/myReview");
  return response.data;
};


// 추천 리뷰 (평균 별점 상위 5개의 여행지)
//export const getRecommendedReviews = async (placeId) => {
//  try {
//    const response = await api.get(`/api/review/recommend/${placeId}`);
//    return response;
//  } catch (error) {
//    console.error("추천 리뷰 조회 실패:", error);
//    throw error;
//  }
//};

// UI → 백엔드 카테고리 매핑
const toBackendCategory = (uiCategory) => {
  const map = {
    hotel: "HOTEL",
    restaurant: "RESTAURANT",
    nightspot: "NIGHTSPOT",
  };
  return map[uiCategory] || uiCategory;
};

// ⭐ 카테고리 기반 추천 Top5
export const getRecommendedReviews = async (uiCategory) => {
  try {
    const category = toBackendCategory(uiCategory);
    const response = await api.get(`/api/review/recommend/${category}`);
    return response.data.data;
  } catch (error) {
    console.error("추천 리뷰 조회 실패:", error);
    throw error;
  }
};