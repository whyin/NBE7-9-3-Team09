import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../../utils/api";
import PageHeader from "../../components/common/PageHeader";
import FriendInvitePanel from "../components/FriendInvitePanel";
import "./PlanCreatePage.css";

export default function PlanCreateForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL 파라미터에서 날짜 가져오기
  const urlStartDate = searchParams.get("start");
  const urlEndDate = searchParams.get("end");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    placeId: "",
    startDate: urlStartDate || "",
    endDate: urlEndDate || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState([]);

  // 오늘 날짜와 10년 후 날짜 계산
  const today = new Date();
  today.setHours(0, 0, 0, 1);
  const minDate = today.toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 10);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  // URL 파라미터가 변경되면 폼 데이터 업데이트
  useEffect(() => {
    if (urlStartDate || urlEndDate) {
      setFormData((prev) => ({
        ...prev,
        startDate: urlStartDate || prev.startDate,
        endDate: urlEndDate || prev.endDate,
      }));
    }
  }, [urlStartDate, urlEndDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "계획 제목을 입력해주세요.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "시작 날짜를 선택해주세요.";
    }

    if (!formData.endDate) {
      newErrors.endDate = "종료 날짜를 선택해주세요.";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (start > end) {
        newErrors.endDate = "종료 날짜는 시작 날짜 이후여야 합니다.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const startDateTime = `${formData.startDate}T00:00:00`;
      const endDateTime = `${formData.endDate}T23:59:59`;

      const requestBody = {
        title: formData.title,
        content: formData.content,
        startDate: startDateTime,
        endDate: endDateTime,
        inviteMembers: invitedMembers.map((member) => member.id),
      };

      const response = await apiRequest(
        "http://localhost:8080/api/plan/create",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
          credentials: "include",
        }
      );

      if (response.status === 200 || response.status === 201) {
        // API 응답에서 planId 추출
        const result = await response.json();
        // 다양한 응답 구조에 대응
        const planId =
          result.data?.id || result.data?.planId || result.id || result.planId;

        if (planId) {
          // 상세 작성 페이지로 이동
          navigate(`/user/plan/detail/${planId}`);
        } else {
          // planId를 찾을 수 없는 경우 목록으로 이동
          console.error("planId를 찾을 수 없습니다. 응답:", result);
          alert("계획이 생성되었습니다.");
          navigate("/user/plan/list");
        }
      } else {
        const errorText = await response.text();
        console.error("계획 생성 실패:", errorText);
        alert("오류가 발생했습니다");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "white",
      backgroundColor: "white",
      padding: "48px 16px",
    },
    wrapper: {
      maxWidth: "672px",
      margin: "0 auto",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      padding: "32px",
    },
    header: {
      marginBottom: "32px",
    },
    title: {
      fontSize: "30px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "8px",
    },
    subtitle: {
      color: "#4b5563",
    },
    formGroup: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      transition: "all 0.2s",
      boxSizing: "border-box",
    },
    inputFocus: {
      outline: "none",
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      resize: "none",
      fontFamily: "inherit",
      transition: "all 0.2s",
      boxSizing: "border-box",
    },
    error: {
      marginTop: "4px",
      fontSize: "14px",
      color: "#dc2626",
    },
    hint: {
      marginTop: "4px",
      fontSize: "12px",
      color: "#6b7280",
    },
    dateGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "16px",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      paddingTop: "16px",
    },
    button: {
      flex: 1,
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
    },
    cancelButton: {
      backgroundColor: "white",
      color: "#374151",
      border: "1px solid #d1d5db",
    },
    submitButton: {
      backgroundColor: "#2563eb",
      color: "white",
    },
    submitButtonDisabled: {
      backgroundColor: "#9ca3af",
      cursor: "not-allowed",
    },
  };

  return (
    <div className="plan-create-container">
      <PageHeader
        title="여행 계획 작성"
        subtitle="새로운 여행 계획을 만들어보세요"
        onBack={() => navigate("/user/plan")}
      />
      <div className="plan-create-layout">
        {/* 좌측: 폼 영역 */}
        <div className="plan-create-form-section">
          <div className="plan-create-card">
            {/* 계획 제목 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>📝 계획 제목</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="예: 제주도 가족 여행"
                style={styles.input}
                onFocus={(e) =>
                  Object.assign(e.target.style, styles.inputFocus)
                }
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.title && <p style={styles.error}>{errors.title}</p>}
            </div>

            {/* 날짜 선택 */}
            <div className="plan-create-date-grid">
              <div style={styles.formGroup}>
                <label style={styles.label}>📅 시작 날짜</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={minDate}
                  max={maxDateStr}
                  style={styles.input}
                  onFocus={(e) =>
                    Object.assign(e.target.style, styles.inputFocus)
                  }
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.startDate && (
                  <p style={styles.error}>{errors.startDate}</p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>⏰ 종료 날짜</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || minDate}
                  max={maxDateStr}
                  style={styles.input}
                  onFocus={(e) =>
                    Object.assign(e.target.style, styles.inputFocus)
                  }
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.endDate && <p style={styles.error}>{errors.endDate}</p>}
              </div>
            </div>

            <p style={styles.hint}>
              ※ 오늘 이전 날짜와 10년 이후 날짜는 선택할 수 없습니다
            </p>

            {/* 내용 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>📄 내용 (선택사항)</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="여행 계획에 대한 설명을 입력해주세요"
                rows="5"
                style={styles.textarea}
                onFocus={(e) =>
                  Object.assign(e.target.style, styles.inputFocus)
                }
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* 제출 버튼 */}
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => window.history.back()}
                style={{ ...styles.button, ...styles.cancelButton }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f9fafb")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  ...styles.button,
                  ...styles.submitButton,
                  ...(isSubmitting ? styles.submitButtonDisabled : {}),
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.target.style.backgroundColor = "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) e.target.style.backgroundColor = "#2563eb";
                }}
              >
                {isSubmitting ? "작성 중..." : "계획 작성"}
              </button>
            </div>
          </div>
        </div>

        {/* 우측: 친구 초대 패널 */}
        <div className="plan-create-panel-section">
          <FriendInvitePanel
            invitedMembers={invitedMembers}
            onInvitesChange={setInvitedMembers}
          />
        </div>
      </div>
    </div>
  );
}
