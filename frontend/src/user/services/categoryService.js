import api from "../../admin/services/api";

// 카테고리 목록 조회 (사용자용)
export const getCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    return response;
  } catch (error) {
    console.error("카테고리 목록 조회 실패:", error);
    throw error;
  }
};

// 카테고리별 여행지 목록 조회 (사용자용)
export const getPlacesByCategory = async (categoryId, page = 0, size = 12, keyword ="") => {
  try {
    const response = await api.get(`/api/place/category/${categoryId}/paged`,
      {
        params:{page,size,...(keyword ? {keyword}:{})}
      }
    );
    return response;
  } catch (error) {
    console.error("카테고리별 여행지 목록 조회 실패:", error);
    throw error;
  }
};

// 카테고리별 여행지 개수 조회 (사용자용)
export const getPlaceCountByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/api/place/category/${categoryId}`);
    return response.data ? response.data.length : 0;
  } catch (error) {
    console.error("카테고리별 여행지 개수 조회 실패:", error);
    return 0;
  }
};
