/**
 * 카테고리별 아이콘을 반환하는 공통 유틸 함수
 * '서울 여행지' 페이지와 동일한 매핑 규칙 사용
 */
export const getCategoryIcon = (categoryName) => {
  if (!categoryName) {
    return "📍";
  }

  // 카테고리 값을 정규화 (대소문자, 공백 제거)
  const normalized = String(categoryName).trim();

  // 정확한 매칭
  const iconMap = {
    // 호텔/숙박
    HOTEL: "🏨",
    hotel: "🏨",
    호텔: "🏨",
    숙소: "🏨",
    숙박: "🏨",
    // 맛집/음식
    맛집: "🍽️",
    음식점: "🍽️",
    FOOD: "🍽️",
    food: "🍽️",
    restaurant: "🍽️",
    // 야경명소
    NIGHTSPOT: "🌃",
    nightspot: "🌃",
    NIGHTVIEW: "🌃",
    nightview: "🌃",
    야경명소: "🌃",
    야경: "🌃",
    // 관광지
    관광지: "🏛️",
    // 북마크
    bookmark: "⭐",
    북마크: "⭐",
  };

  // 정확한 매칭 시도
  if (iconMap[normalized]) {
    return iconMap[normalized];
  }

  // 대소문자 구분 없이 매칭
  const upper = normalized.toUpperCase();
  const lower = normalized.toLowerCase();

  if (iconMap[upper]) {
    return iconMap[upper];
  }
  if (iconMap[lower]) {
    return iconMap[lower];
  }

  // 키워드 기반 부분 매칭
  const lowerNormalized = lower;
  if (
    lowerNormalized.includes("hotel") ||
    lowerNormalized.includes("숙박") ||
    lowerNormalized.includes("숙소")
  ) {
    return "🏨";
  }
  if (
    lowerNormalized.includes("food") ||
    lowerNormalized.includes("restaurant") ||
    lowerNormalized.includes("맛집") ||
    lowerNormalized.includes("음식")
  ) {
    return "🍽️";
  }
  if (
    lowerNormalized.includes("night") ||
    lowerNormalized.includes("야경") ||
    lowerNormalized.includes("경치")
  ) {
    return "🌃";
  }
  if (
    lowerNormalized.includes("bookmark") ||
    lowerNormalized.includes("북마크")
  ) {
    return "⭐";
  }
  if (lowerNormalized.includes("관광")) {
    return "🏛️";
  }

  // 기본값
  return "📍";
};

/**
 * 카테고리별 CSS 클래스 이름을 반환하는 함수
 */
export const getCategoryClass = (categoryName) => {
  if (!categoryName) {
    return "";
  }

  const normalized = String(categoryName).trim().toLowerCase();

  if (
    normalized.includes("hotel") ||
    normalized.includes("숙박") ||
    normalized.includes("숙소")
  ) {
    return "category-hotel";
  }
  if (
    normalized.includes("food") ||
    normalized.includes("restaurant") ||
    normalized.includes("맛집") ||
    normalized.includes("음식")
  ) {
    return "category-restaurant";
  }
  if (
    normalized.includes("night") ||
    normalized.includes("야경") ||
    normalized.includes("경치")
  ) {
    return "category-nightspot";
  }
  if (normalized.includes("bookmark") || normalized.includes("북마크")) {
    return "category-bookmark";
  }

  return "";
};

/**
 * 카테고리별 정보(아이콘, 라벨, 색상, 클래스)를 반환하는 함수
 */
export const getCategoryInfo = (categoryName) => {
  const icon = getCategoryIcon(categoryName);
  const className = getCategoryClass(categoryName);

  const infoMap = {
    // 호텔/숙박
    HOTEL: { icon, label: "숙박", color: "#e8f1ff", class: className },
    hotel: { icon, label: "숙박", color: "#e8f1ff", class: className },
    호텔: { icon, label: "숙박", color: "#e8f1ff", class: className },
    숙소: { icon, label: "숙박", color: "#e8f1ff", class: className },
    // 맛집/음식
    맛집: { icon, label: "맛집", color: "#fff7e0", class: className },
    음식점: { icon, label: "맛집", color: "#fff7e0", class: className },
    FOOD: { icon, label: "맛집", color: "#fff7e0", class: className },
    food: { icon, label: "맛집", color: "#fff7e0", class: className },
    restaurant: { icon, label: "맛집", color: "#fff7e0", class: className },
    // 야경명소
    NIGHTSPOT: { icon, label: "야경명소", color: "#f3e8ff", class: className },
    nightspot: { icon, label: "야경명소", color: "#f3e8ff", class: className },
    NIGHTVIEW: { icon, label: "야경명소", color: "#f3e8ff", class: className },
    nightview: { icon, label: "야경명소", color: "#f3e8ff", class: className },
    야경명소: { icon, label: "야경명소", color: "#f3e8ff", class: className },
    // 북마크
    bookmark: { icon, label: "북마크", color: "#f0fdf4", class: className },
    북마크: { icon, label: "북마크", color: "#f0fdf4", class: className },
  };

  const normalized = String(categoryName || "").trim();

  if (infoMap[normalized]) {
    return infoMap[normalized];
  }

  // 대소문자 구분 없이 매칭
  const upper = normalized.toUpperCase();
  const lower = normalized.toLowerCase();

  if (infoMap[upper]) {
    return infoMap[upper];
  }
  if (infoMap[lower]) {
    return infoMap[lower];
  }

  // 키워드 기반 매칭
  const lowerNormalized = lower;
  if (
    lowerNormalized.includes("hotel") ||
    lowerNormalized.includes("숙박") ||
    lowerNormalized.includes("숙소")
  ) {
    return { icon, label: "숙박", color: "#e8f1ff", class: "category-hotel" };
  }
  if (
    lowerNormalized.includes("food") ||
    lowerNormalized.includes("restaurant") ||
    lowerNormalized.includes("맛집") ||
    lowerNormalized.includes("음식")
  ) {
    return {
      icon,
      label: "맛집",
      color: "#fff7e0",
      class: "category-restaurant",
    };
  }
  if (
    lowerNormalized.includes("night") ||
    lowerNormalized.includes("야경") ||
    lowerNormalized.includes("경치")
  ) {
    return {
      icon,
      label: "야경명소",
      color: "#f3e8ff",
      class: "category-nightspot",
    };
  }
  if (
    lowerNormalized.includes("bookmark") ||
    lowerNormalized.includes("북마크")
  ) {
    return {
      icon,
      label: "북마크",
      color: "#f0fdf4",
      class: "category-bookmark",
    };
  }

  // 기본값
  return { icon, label: "기타", color: "#f3f4f6", class: "" };
};
