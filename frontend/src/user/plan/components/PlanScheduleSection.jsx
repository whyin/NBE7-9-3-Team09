import React, { useState } from "react";
import { getCategoryIcon, getCategoryInfo } from "../../utils/categoryUtils";
import "./PlanScheduleSection.css";

export default function PlanScheduleSection({
  planDetails,
  plan,
  categories,
  selectedCategory,
  onCategorySelect,
  recommendedPlaces,
  showPlaceList,
  loadingPlaces,
  newDetail,
  onNewDetailChange,
  onPlaceSelect,
  showAddForm,
  onToggleAddForm,
  onAddDetail,
  isAddFormValid,
  editingDetailId,
  editingDetailData,
  onEditingDetailChange,
  editSelectedCategory,
  onEditCategorySelect,
  editRecommendedPlaces,
  editShowPlaceList,
  editLoadingPlaces,
  onEditPlaceSelect,
  onEditDetail,
  onUpdateDetail,
  onCancelEditDetail,
  onDeleteDetail,
  getDetailCategory,
}) {
  const formatDetailDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isTimeInRange = (time) => {
    if (!plan || !time) return true;
    const timeDate = new Date(time);
    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.endDate);
    return timeDate >= startDate && timeDate <= endDate;
  };

  return (
    <div className="plan-schedule-section">
      <div className="plan-schedule-header">
        <h2 className="plan-schedule-title">여행 상세 일정</h2>
        <button
          onClick={onToggleAddForm}
          className={`plan-schedule-add-btn ${showAddForm ? "cancel" : ""}`}
        >
          {showAddForm ? "취소" : "+ 새 일정 추가"}
        </button>
      </div>

      {showAddForm && (
        <div className="plan-schedule-add-form">
          <div className="plan-schedule-form-group">
            <label className="plan-schedule-form-label">카테고리</label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategorySelect(e.target.value)}
              className="plan-schedule-form-select"
            >
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {loadingPlaces && (
            <div className="plan-schedule-form-group full-width">
              <p>추천 여행지를 불러오는 중...</p>
            </div>
          )}

          {showPlaceList && recommendedPlaces.length > 0 && (
            <div className="plan-schedule-form-group full-width">
              <label className="plan-schedule-form-label">추천 여행지</label>
              <div className="plan-schedule-place-list">
                {recommendedPlaces.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => onPlaceSelect(place)}
                    className={`plan-schedule-place-item ${
                      newDetail.placeId === place.id ? "selected" : ""
                    }`}
                  >
                    <div className="plan-schedule-place-name">
                      ⭐ {place.averageRating.toFixed(2)} {place.placeName}
                    </div>
                    <div className="plan-schedule-place-address">
                      {place.address}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newDetail.placeName && (
            <div className="plan-schedule-form-group full-width">
              <label className="plan-schedule-form-label">선택된 장소</label>
              <div className="plan-schedule-selected-place">
                <strong>{newDetail.placeName}</strong>
              </div>
            </div>
          )}

          <div className="plan-schedule-form-group">
            <label className="plan-schedule-form-label">시작 시간</label>
            <input
              type="datetime-local"
              value={newDetail.startTime}
              onChange={(e) =>
                onNewDetailChange({ ...newDetail, startTime: e.target.value })
              }
              className="plan-schedule-form-input"
            />
            {newDetail.startTime && !isTimeInRange(newDetail.startTime) && (
              <p className="plan-schedule-form-error">
                시작 시간은 계획 기간 내에 있어야 합니다.
              </p>
            )}
          </div>

          <div className="plan-schedule-form-group">
            <label className="plan-schedule-form-label">종료 시간</label>
            <input
              type="datetime-local"
              value={newDetail.endTime}
              onChange={(e) =>
                onNewDetailChange({ ...newDetail, endTime: e.target.value })
              }
              className="plan-schedule-form-input"
            />
            {newDetail.endTime && !isTimeInRange(newDetail.endTime) && (
              <p className="plan-schedule-form-error">
                종료 시간은 계획 기간 내에 있어야 합니다.
              </p>
            )}
          </div>

          <div className="plan-schedule-form-group">
            <label className="plan-schedule-form-label">제목</label>
            <input
              type="text"
              value={newDetail.title}
              onChange={(e) =>
                onNewDetailChange({ ...newDetail, title: e.target.value })
              }
              className="plan-schedule-form-input"
              placeholder="일정 제목"
            />
          </div>

          <div className="plan-schedule-form-group full-width">
            <label className="plan-schedule-form-label">내용</label>
            <textarea
              value={newDetail.content}
              onChange={(e) =>
                onNewDetailChange({ ...newDetail, content: e.target.value })
              }
              className="plan-schedule-form-textarea"
              placeholder="일정 설명"
            />
          </div>

          <button
            onClick={onAddDetail}
            disabled={!isAddFormValid()}
            className="plan-schedule-form-submit"
          >
            저장
          </button>
        </div>
      )}

      {planDetails.length === 0 ? (
        <div className="plan-schedule-empty">
          <div className="plan-schedule-empty-icon">📅</div>
          <p className="plan-schedule-empty-text">
            아직 등록된 상세 일정이 없습니다.
          </p>
        </div>
      ) : (
        <div className="plan-schedule-list">
          {planDetails.map((detail) => {
            const category = getDetailCategory(detail);
            const categoryInfo = getCategoryInfo(category);
            return (
              <div
                key={detail.id}
                className={`plan-schedule-item ${categoryInfo.class} ${
                  editingDetailId === detail.id ? "editing" : ""
                }`}
              >
                {editingDetailId === detail.id ? (
                  <div className="plan-schedule-edit-form">
                    <div className="plan-schedule-edit-group">
                      <label className="plan-schedule-edit-label">카테고리</label>
                      <select
                        value={editSelectedCategory}
                        onChange={(e) => onEditCategorySelect(e.target.value)}
                        className="plan-schedule-edit-input"
                      >
                        <option value="">카테고리 선택</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {editLoadingPlaces && (
                      <div className="plan-schedule-edit-group full-width">
                        <p>추천 여행지를 불러오는 중...</p>
                      </div>
                    )}

                    {editShowPlaceList && editRecommendedPlaces.length > 0 && (
                      <div className="plan-schedule-edit-group full-width">
                        <label className="plan-schedule-edit-label">
                          추천 여행지
                        </label>
                        <div className="plan-schedule-place-list">
                          {editRecommendedPlaces.map((place) => (
                            <div
                              key={place.id}
                              onClick={() => onEditPlaceSelect(place)}
                              className={`plan-schedule-place-item ${
                                editingDetailData.placeId === place.id
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              <div className="plan-schedule-place-name">
                                ⭐ {place.averageRating.toFixed(2)}{" "}
                                {place.placeName}
                              </div>
                              <div className="plan-schedule-place-address">
                                {place.address}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {editingDetailData.placeName && (
                      <div className="plan-schedule-edit-group full-width">
                        <label className="plan-schedule-edit-label">
                          선택된 장소
                        </label>
                        <div className="plan-schedule-selected-place">
                          <strong>{editingDetailData.placeName}</strong>
                        </div>
                      </div>
                    )}

                    <div className="plan-schedule-edit-group">
                      <label className="plan-schedule-edit-label">시작 시간</label>
                      <input
                        type="datetime-local"
                        value={editingDetailData.startTime}
                        onChange={(e) =>
                          onEditingDetailChange({
                            ...editingDetailData,
                            startTime: e.target.value,
                          })
                        }
                        className="plan-schedule-edit-input"
                      />
                    </div>

                    <div className="plan-schedule-edit-group">
                      <label className="plan-schedule-edit-label">종료 시간</label>
                      <input
                        type="datetime-local"
                        value={editingDetailData.endTime}
                        onChange={(e) =>
                          onEditingDetailChange({
                            ...editingDetailData,
                            endTime: e.target.value,
                          })
                        }
                        className="plan-schedule-edit-input"
                      />
                    </div>

                    <div className="plan-schedule-edit-group">
                      <label className="plan-schedule-edit-label">제목</label>
                      <input
                        type="text"
                        value={editingDetailData.title}
                        onChange={(e) =>
                          onEditingDetailChange({
                            ...editingDetailData,
                            title: e.target.value,
                          })
                        }
                        className="plan-schedule-edit-input"
                      />
                    </div>

                    <div className="plan-schedule-edit-group full-width">
                      <label className="plan-schedule-edit-label">내용</label>
                      <textarea
                        value={editingDetailData.content}
                        onChange={(e) =>
                          onEditingDetailChange({
                            ...editingDetailData,
                            content: e.target.value,
                          })
                        }
                        className="plan-schedule-edit-textarea"
                      />
                    </div>

                    <div className="plan-schedule-edit-actions">
                      <button
                        onClick={() => onUpdateDetail(detail.id)}
                        className="plan-schedule-edit-save-btn"
                      >
                        저장
                      </button>
                      <button
                        onClick={onCancelEditDetail}
                        className="plan-schedule-edit-cancel-btn"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="plan-schedule-item-icon">
                      {getCategoryIcon(category)}
                    </div>
                    <div className="plan-schedule-item-content">
                      <div className="plan-schedule-item-header">
                        <div>
                          <h3 className="plan-schedule-item-title">
                            {detail.title}
                          </h3>
                          <div className="plan-schedule-item-time">
                            🕐 {formatDetailDateTime(detail.startTime)} ~{" "}
                            {formatDetailDateTime(detail.endTime)}
                          </div>
                          <div className="plan-schedule-item-place">
                            📍 {detail.placeName}
                          </div>
                        </div>
                        <div className="plan-schedule-item-actions">
                          <button
                            onClick={() => onEditDetail(detail)}
                            className="plan-schedule-item-edit-btn"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => onDeleteDetail(detail.id)}
                            className="plan-schedule-item-delete-btn"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      {detail.content && (
                        <p className="plan-schedule-item-description">
                          {detail.content}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

