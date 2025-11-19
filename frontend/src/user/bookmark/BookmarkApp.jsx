import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest, showErrorToast } from "../../utils/api.js";
import PlanDetailModal from "./PlanDetailModal.jsx";
import PageHeader from "../components/common/PageHeader";
import "./BookmarkApp.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function BookmarkApp() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busyIds, setBusyIds] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  const [page, setPage] = useState(0); // 현재 페이지 (0부터 시작)
  const [size] = useState(12); // 한 페이지에 몇 개 보여줄지
  const [pageInfo, setPageInfo] = useState({
    totalPages : 0,
    totalElements: 0,
  });

   // --- 북마크 불러오기 ---
  const fetchBookmarks = useCallback(
    async (pageParam = page) => {
      setLoading(true);
      setError(null);
  
      try {
        const res = await apiRequest(
          `${API_BASE}/api/bookmarks/paged?page=${pageParam}&size=${size}`,
          { method: "GET" }
        );
        if (!res.ok) throw res;
  
        const body = await res.json();
        const pageData = body.data ?? body;
  
        setBookmarks(pageData.content ?? []);
        setPageInfo({
          totalPages: pageData.totalPages ?? 0,
          totalElements: pageData.totalElements ?? 0,
        });
  
        return pageData; // 필요하면 리턴값도 쓸 수 있게
      } catch (err) {
        setError("북마크를 불러오는 중 오류가 발생했습니다.");
        await showErrorToast(err, toast);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [page, size]
  );

  // --- 북마크 삭제 ---
  const handleDelete = async (bookmark) => {
    console.log("handleDelete called", bookmark);
    const bookmarkId = bookmark.bookmarkId;
    if (!bookmarkId || busyIds[bookmarkId]) return;
  
    setBusyIds((s) => ({ ...s, [bookmarkId]: true }));
  
    // 🎯 낙관적 업데이트: 일단 화면에서 먼저 빼기
    setBookmarks((list) => list.filter((b) => b.bookmarkId !== bookmarkId));
  
    try {
      const res = await apiRequest(`${API_BASE}/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
  
      toast.success("북마크가 삭제되었습니다.");
  
      // ❗❗ 여기 중요: 삭제 후 현재 페이지 다시 로딩
      await fetchBookmarks(page);
    } catch (err) {
      // 삭제 실패하면 다시 복원해주고
      await showErrorToast(err, toast);
      // 복원은 이전 상태 저장해두고 쓰고 싶으면 위에서 prev 저장해서 setBookmarks(prev) 하면 됨
    } finally {
      setBusyIds((s) => {
        const n = { ...s };
        delete n[bookmarkId];
        return n;
      });
    }
  };
  

  useEffect(() => {
    fetchBookmarks(page);
  }, [page, size, fetchBookmarks]);
  

  return (
    <div
      className="p-4 max-w-4xl mx-auto"
      style={{ position: "relative", zIndex: 2 }}
    >
      <PageHeader title="내 북마크" />
      <ToastContainer position="top-right" autoClose={2500} />

      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : bookmarks.length === 0 ? (
        <div className="text-gray-500">저장된 북마크가 없습니다.</div>
      ) : (
        <>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {bookmarks.map((b) => (
              <li
                key={b.bookmarkId}
                className="border rounded p-2 bg-white shadow-sm"
              >
                <div className="font-semibold">{b.placeName ?? b.title}</div>
                {b.address && (
                  <div className="text-sm text-gray-500">{b.address}</div>
                )}
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={() => handleDelete(b)}
                    disabled={!!busyIds[b.bookmarkId]}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    {busyIds[b.bookmarkId] ? "삭제중..." : "삭제"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBookmark(b);
                      setShowModal(true);
                    }}
                    className="px-2 py-1 border rounded text-sm bg-blue-100"
                  >
                    추가하기
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* ⭐ 페이징 컨트롤 */}
          <div className="flex items-center justify-between mt-4">
            <button
              className="px-3 py-1 border rounded text-sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              이전
            </button>

            <div className="text-sm text-gray-700">
              페이지 {page + 1} / {pageInfo.totalPages || 1}{" "}
              <span className="ml-2 text-gray-400">
                (총 {pageInfo.totalElements}개)
              </span>
            </div>

            <button
              className="px-3 py-1 border rounded text-sm"
              disabled={page + 1 >= pageInfo.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </button>
          </div>
        </>
      )}

      {showModal && selectedBookmark && (
        <PlanDetailModal
          bookmark={selectedBookmark}
          onClose={() => {
            setShowModal(false);
            setSelectedBookmark(null);
          }}
        />
      )}
    </div>
  );
}
