// Kakao 지도 초기화 추가
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlacesByCategory, getCategories } from "../../services/categoryService";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
} from "../../services/bookmarkService";
import "./PlaceListPage.css";

// Kakao Maps SDK 타입 선언 (JavaScript 파일이므로 주석으로 처리)
// TypeScript를 사용한다면 아래 주석을 활성화:
// declare global {
//   interface Window {
//     kakao: any;
//   }
// }
// JavaScript에서는 window.kakao를 직접 사용하므로 ESLint 경고만 비활성화
/* eslint-disable no-undef */

const PlaceListPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [pageInfo, setPageInfo] = useState({
    totalPages:0,
    totalElements:0,
  });
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

useEffect(()=>{
  setPage(0);
},[searchTerm]);
  
  useEffect(() => {
    fetchCategories();
    fetchPlaces();
    fetchBookmarks();
  }, [categoryId,page,searchTerm]);

  const loadScriptElement = (resolve, reject) => {
    console.log("📥 Loading Kakao Maps SDK dynamically...");
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=98cd8f8073f4bb066951b78ed19c9cf6";
    script.async = false; // 동기 로드

    script.onload = () => {
      console.log("✅ Kakao Maps SDK script loaded");
      // SDK가 완전히 초기화될 때까지 약간 대기
      let attempts = 0;
      const maxAttempts = 50; // 5초

      const checkInterval = setInterval(() => {
        attempts++;
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkInterval);
          console.log("✅ Kakao Maps SDK initialized");
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error("Kakao Maps SDK initialization timeout"));
        }
      }, 100);
    };

    script.onerror = () => {
      console.error("❌ Failed to load Kakao Maps SDK script");
      reject(new Error("Failed to load Kakao Maps SDK"));
    };

    document.head.appendChild(script);
  };

  // Kakao Maps SDK 동적 로드 함수
  const loadKakaoSDK = () => {
    return new Promise((resolve, reject) => {
      // 이미 로드되어 있으면 즉시 resolve
      if (window.kakao && window.kakao.maps) {
        console.log("✅ Kakao Maps SDK already loaded");
        resolve();
        return;
      }

      // 이미 스크립트 태그가 있으면 로드 대기
      const existingScript = document.querySelector(
        'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
      );
      if (existingScript) {
        console.log("⏳ Kakao Maps SDK script tag exists, waiting for load...");
        let attempts = 0;
        const maxAttempts = 100; // 10초

        const checkInterval = setInterval(() => {
          attempts++;
          if (window.kakao && window.kakao.maps) {
            clearInterval(checkInterval);
            console.log("✅ Kakao Maps SDK loaded from existing script");
            resolve();
          } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            console.warn(
              "⚠️ Existing Kakao Maps script did not load. Reloading..."
            );
            existingScript.remove();
            loadScriptElement(resolve, reject);
          }
        }, 100);
        return;
      }

      loadScriptElement(resolve, reject);
    });
  };

  // Kakao 지도 초기화 - 컴포넌트 마운트 후 한 번만 실행
  useEffect(() => {
    const initMap = async () => {
      try {
        // SDK 로드
        await loadKakaoSDK();

        // 지도 컨테이너 요소 확인
        const container = document.getElementById("map");
        if (!container) {
          console.error("Map container not found");
          return;
        }

        // 지도 초기화
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 5,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapInstanceRef.current = map;
        console.log("✅ Kakao 지도 초기화 완료", map);
      } catch (err) {
        console.error("❌ 카카오 지도 초기화 오류:", err);
      }
    };

    initMap();
  }, []);

  // 여행지 목록 변화 시 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao?.maps) {
      return;
    }

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();
    let hasValidMarker = false;

    filteredPlaces.forEach((place) => {
      const { latitude, longitude, placeName } = place || {};
      if (
        latitude === null ||
        latitude === undefined ||
        longitude === null ||
        longitude === undefined
      ) {
        return;
      }

      const lat = Number(latitude);
      const lng = Number(longitude);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return;
      }

      const position = new window.kakao.maps.LatLng(lat, lng);
      const marker = new window.kakao.maps.Marker({
        position,
        title: placeName || "여행지",
      });

      marker.setMap(mapInstanceRef.current);
      markersRef.current.push(marker);
      bounds.extend(position);
      hasValidMarker = true;
    });

    if (hasValidMarker) {
      mapInstanceRef.current.setBounds(bounds);
    }

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [filteredPlaces]);

  // // 검색 기능
  // useEffect(() => {
  //   if (searchTerm.trim() === "") {
  //     setFilteredPlaces(places);
  //   } else {
  //     const filtered = places.filter((place) => {
  //       const name = (place.placeName || "").toLowerCase();
  //       const address = (place.address || "").toLowerCase();
  //       const gu = (place.gu || "").toLowerCase();
  //       const search = searchTerm.toLowerCase();

  //       return (
  //         name.includes(search) ||
  //         address.includes(search) ||
  //         gu.includes(search)
  //       );
  //     });
  //     setFilteredPlaces(filtered);
  //   }
  // }, [places, searchTerm]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await getPlacesByCategory(categoryId,page,size,searchTerm.trim());

      const body = response.data;
      const pageData = body.data ?? body;
      const content = pageData.content ?? [];

      // 별점순으로 정렬 (높은 별점부터)
      const sortedPlaces = [...content].sort(
        (a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0)
      );
      setPlaces(sortedPlaces);
      setFilteredPlaces(sortedPlaces);
      setPageInfo({
        totalPages: pageData.totalPages ?? 0,
        totalElements: pageData.totalElements ?? 0,
      });

      console.log("📍 places from API:", sortedPlaces);
      setError(null);
    } catch (err) {
      console.error("여행지 목록 조회 오류:", err);
      setError("여행지 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceClick = (place) => {
    const map = mapInstanceRef.current;
    if (!map || !window.kakao || !window.kakao.maps) {
      return;
    }
    if (
      place.latitude === null ||
      place.latitude === undefined ||
      place.longitude === null ||
      place.longitude === undefined
    ) {
      return;
    }

    const lat = Number(place.latitude);
    const lng = Number(place.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return;
    }

    const position = new window.kakao.maps.LatLng(lat, lng);
    map.panTo(position);
  };

  const fetchBookmarks = async () => {
    try {
      const response = await getBookmarks();
      const bookmarkIds = new Set(
        response.data.map((bookmark) => bookmark.placeId)
      );
      setBookmarks(bookmarkIds);
    } catch (err) {
      console.error("북마크 목록 조회 오류:", err);
    }
  };

  const handleBookmarkToggle = async (placeId) => {
    try {
      if (bookmarks.has(placeId)) {
        // 북마크 제거
        await removeBookmark(placeId);
        setBookmarks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(placeId);
          return newSet;
        });
        alert("북마크에서 제거되었습니다.");
      } else {
        // 북마크 추가
        await addBookmark(placeId);
        setBookmarks((prev) => new Set([...prev, placeId]));
        alert("북마크에 추가되었습니다.");
      }
    } catch (err) {
      console.error("북마크 토글 오류:", err);
      alert("북마크 처리 중 오류가 발생했습니다.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error("카테고리 목록 조회 오류:", err);
    }
  };

  const getCategoryDisplayName = (categoryName) => {
    const nameMap = {
      NIGHTSPOT: "야경명소",
      맛집: "맛집",
    };
    return nameMap[categoryName] || categoryName;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (c) => String(c.id) === String(categoryId)
    );
    return category ? getCategoryDisplayName(category.name) : "여행지";
  };

  const renderStars = (rating = 0) => {
    const normalized = Math.max(0, Math.min(5, Number(rating) || 0));

    return Array.from({ length: 5 }).map((_, index) => {
      const value = index + 1;
      let className = "star empty";

      if (normalized >= value) {
        className = "star filled";
      } else if (normalized >= value - 0.5) {
        className = "star half";
      }

      return (
        <span key={value} className={className} aria-hidden="true">
          ★
        </span>
      );
    });
  };

  return (
    <div className="place-list-page">
      <header className="page-header">
        <button
          className="back-button"
          onClick={() => navigate("/user/places")}
        >
          ← 뒤로가기
        </button>
        <div className="header-content">
          <h1>{getCategoryName(categoryId)}</h1>
          <p>
            {loading
              ? "여행지를 불러오는 중..."
              : searchTerm.trim()
              ? `검색 결과 ${pageInfo.totalElements || 0}개의 여행지가 있습니다`
              : `${pageInfo.totalElements || 0}개의 여행지가 있습니다`}
          </p>
        </div>
      </header>
  
      {/* 🔻 헤더 아래 메인 레이아웃: 왼쪽(검색+지도) / 오른쪽(목록) */}
      <div className="place-main-layout">
        {/* 👈 왼쪽 패널: 검색 + 지도 (sticky) */}
        <div className="left-panel">
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="여행지명, 주소, 구로 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
            </div>
          </div>
  
          <div className="map-container">
            <div
              id="map"
              style={{
                width: "100%",
                height: "400px",
                borderRadius: "16px",
              }}
            />
          </div>
        </div>
  
        {/* 👉 오른쪽 패널: 여행지 목록 + 페이지네이션 (스크롤 영역) */}
        <div className="right-panel">
          {error && <div className="error">{error}</div>}
  
          {loading ? (
            <div className="loading">여행지를 불러오는 중...</div>
          ) : (
            <div className="places-container">
              {filteredPlaces.length > 0 ? (
                <>
                  <div className="places-grid">
                    {filteredPlaces.map((place) => (
                      <div
                        key={place.id}
                        className="place-card"
                        onClick={() => handlePlaceClick(place)}
                      >
                        <div className="place-header">
                          <h3 className="place-name">
                            {place.placeName || "여행지명 없음"}
                          </h3>
                          <button
                            className={`bookmark-button ${
                              bookmarks.has(place.id) ? "bookmarked" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation(); // 카드 클릭이랑 분리
                              handleBookmarkToggle(place.id);
                            }}
                            title={
                              bookmarks.has(place.id)
                                ? "북마크에서 제거"
                                : "북마크에 추가"
                            }
                          >
                            {bookmarks.has(place.id) ? "❤️" : "🤍"}
                          </button>
                        </div>
  
                        <div className="place-info">
                          <p className="place-address">
                            📍 {place.address || "주소 정보 없음"}
                          </p>
                          <p className="place-gu">
                            🏘️ {place.gu || "구 정보 없음"}
                          </p>
                        </div>
  
                        <div className="place-rating">
                          <div className="stars">
                            {renderStars(place.ratingAvg)}
                          </div>
                          <span className="rating-text">
                            <strong>
                              {(Number(place.ratingAvg) || 0).toFixed(2)}
                            </strong>
                            <span className="rating-count">
                              &nbsp;· {place.ratingCount || 0}개 리뷰
                            </span>
                          </span>
                        </div>
  
                        {place.description && (
                          <div className="place-description">
                            <p>{place.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
  
                  {/* 👉 오른쪽 목록 맨 아래 페이지네이션 */}
                  <div className="pagination-controls">
                    <button
                      className="page-button"
                      disabled={page === 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                      이전
                    </button>
  
                    <span className="page-info-text">
                      페이지 {page + 1} / {pageInfo.totalPages || 1}
                      <span className="page-total-text">
                        (총 {pageInfo.totalElements || 0}개)
                      </span>
                    </span>
  
                    <button
                      className="page-button"
                      disabled={page + 1 >= pageInfo.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      다음
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>검색 결과가 없습니다</h3>
                  <p>다른 검색어로 시도해보세요.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceListPage;
