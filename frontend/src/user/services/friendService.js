import { apiRequest } from "../../utils/api";

// 친구 검색 (닉네임 또는 이메일)
export const searchFriends = async (query) => {
  try {
    const response = await apiRequest(
      `http://localhost:8080/api/friends/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("친구 검색에 실패했습니다.");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("친구 검색 실패:", error);
    throw error;
  }
};

// 계획에 친구 초대
export const inviteFriendsToPlan = async (planId, friendIds) => {
  try {
    const response = await apiRequest(
      `http://localhost:8080/api/plan/${planId}/invite`,
      {
        method: "POST",
        body: JSON.stringify({ friendIds }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("친구 초대에 실패했습니다.");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("친구 초대 실패:", error);
    throw error;
  }
};

// 계획 참여자 목록 조회
export const getPlanMembers = async (planId) => {
  try {
    const response = await apiRequest(
      `http://localhost:8080/api/plan/${planId}/members`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("참여자 목록 조회에 실패했습니다.");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("참여자 목록 조회 실패:", error);
    throw error;
  }
};

// 계획에서 멤버 제거 (강퇴)
export const removeMemberFromPlan = async (planId, memberId) => {
  try {
    const response = await apiRequest(
      `http://localhost:8080/api/plan/${planId}/members/${memberId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("멤버 제거에 실패했습니다.");
    }

    return true;
  } catch (error) {
    console.error("멤버 제거 실패:", error);
    throw error;
  }
};

// 계획에서 나가기
export const leavePlan = async (planId) => {
  try {
    const response = await apiRequest(
      `http://localhost:8080/api/plan/${planId}/leave`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("계획 나가기에 실패했습니다.");
    }

    return true;
  } catch (error) {
    console.error("계획 나가기 실패:", error);
    throw error;
  }
};

// 현재 사용자 정보 조회
export const getCurrentUser = async () => {
  try {
    const response = await apiRequest(
      `http://localhost:8080/api/members/me`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("사용자 정보 조회에 실패했습니다.");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    throw error;
  }
};

