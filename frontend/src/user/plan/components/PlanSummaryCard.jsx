import React from "react";
import "./PlanSummaryCard.css";

export default function PlanSummaryCard({
  plan,
  isEditing,
  editData,
  onEditChange,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) {
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="plan-summary-card">
      <div className="plan-summary-header">
        {!isEditing ? (
          <>
            <h3 className="plan-summary-title">{plan.title}</h3>
            <div className="plan-summary-actions">
              <button
                onClick={onEdit}
                className="plan-summary-edit-btn"
              >
                수정
              </button>
              <button
                onClick={onDelete}
                className="plan-summary-delete-btn"
              >
                삭제
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="plan-summary-title">계획 수정</h3>
            <div className="plan-summary-actions">
              <button
                onClick={onSave}
                className="plan-summary-save-btn"
              >
                저장
              </button>
              <button
                onClick={onCancel}
                className="plan-summary-cancel-btn"
              >
                취소
              </button>
            </div>
          </>
        )}
      </div>

      {!isEditing ? (
        <>
          <div className="plan-summary-date">
            {formatDateTime(plan.startDate)} ~ {formatDateTime(plan.endDate)}
          </div>
          {plan.content && (
            <p className="plan-summary-content">{plan.content}</p>
          )}
        </>
      ) : (
        <div className="plan-summary-edit-form">
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              onEditChange({ ...editData, title: e.target.value })
            }
            placeholder="계획 제목"
            className="plan-summary-edit-input"
          />
          <textarea
            value={editData.content}
            onChange={(e) =>
              onEditChange({ ...editData, content: e.target.value })
            }
            placeholder="계획 설명"
            className="plan-summary-edit-textarea"
          />
          <input
            type="datetime-local"
            value={editData.startDate}
            onChange={(e) =>
              onEditChange({ ...editData, startDate: e.target.value })
            }
            className="plan-summary-edit-input"
          />
          <input
            type="datetime-local"
            value={editData.endDate}
            onChange={(e) =>
              onEditChange({ ...editData, endDate: e.target.value })
            }
            className="plan-summary-edit-input"
          />
        </div>
      )}
    </div>
  );
}

