import React, { useState, useEffect, useRef } from "react";
import { searchFriends, inviteFriendsToPlan } from "../../services/friendService";
import "./FriendInviteModal.css";

export default function FriendInviteModal({ planId, onClose, onSuccess }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchRef = useRef(null);
  const modalRef = useRef(null);

  // 검색어 변경 시 디바운스 처리
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    if (searchQuery.trim().length < 2) {
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchFriends(searchQuery);
        // 이미 선택된 친구는 제외
        const filteredResults = results.filter(
          (friend) => !selectedFriends.some((sf) => sf.id === friend.id)
        );
        setSearchResults(filteredResults);
        setShowResults(true);
      } catch (error) {
        console.error("친구 검색 실패:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedFriends]);

  // 외부 클릭 시 모달 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleAddFriend = (friend) => {
    if (!selectedFriends.some((sf) => sf.id === friend.id)) {
      setSelectedFriends([...selectedFriends, friend]);
      setSearchQuery("");
      setShowResults(false);
    }
  };

  const handleRemoveFriend = (friendId) => {
    setSelectedFriends(selectedFriends.filter((sf) => sf.id !== friendId));
  };

  const handleSubmit = async () => {
    if (selectedFriends.length === 0) {
      alert("초대할 친구를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const friendIds = selectedFriends.map((f) => f.id);
      await inviteFriendsToPlan(planId, friendIds);
      alert("친구 초대가 완료되었습니다.");
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      alert("친구 초대에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="friend-invite-modal-overlay">
      <div className="friend-invite-modal" ref={modalRef}>
        <div className="friend-invite-modal-header">
          <h3 className="friend-invite-modal-title">👥 친구 초대</h3>
          <button
            className="friend-invite-modal-close"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="friend-invite-modal-content">
          <p className="friend-invite-modal-subtitle">
            함께 여행할 친구를 추가해보세요
          </p>

          <div className="friend-invite-modal-search" ref={searchRef}>
            <input
              type="text"
              className="friend-invite-modal-search-input"
              placeholder="닉네임 또는 이메일로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowResults(true);
                }
              }}
            />
            {isSearching && (
              <div className="friend-invite-modal-search-loading">검색 중...</div>
            )}
            {showResults && searchResults.length > 0 && (
              <div className="friend-invite-modal-search-results">
                {searchResults.map((friend) => (
                  <div
                    key={friend.id}
                    className="friend-invite-modal-search-result-item"
                    onClick={() => handleAddFriend(friend)}
                  >
                    <div className="friend-invite-modal-avatar">
                      {friend.profileImage ? (
                        <img
                          src={friend.profileImage}
                          alt={friend.nickname}
                          className="friend-invite-modal-avatar-img"
                        />
                      ) : (
                        <span className="friend-invite-modal-avatar-initial">
                          {getAvatarInitial(friend.nickname)}
                        </span>
                      )}
                    </div>
                    <div className="friend-invite-modal-result-info">
                      <div className="friend-invite-modal-result-name">
                        {friend.nickname}
                      </div>
                      <div className="friend-invite-modal-result-email">
                        {friend.email}
                      </div>
                    </div>
                    <button
                      className="friend-invite-modal-add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddFriend(friend);
                      }}
                    >
                      추가
                    </button>
                  </div>
                ))}
              </div>
            )}
            {showResults &&
              searchQuery.trim().length >= 2 &&
              searchResults.length === 0 &&
              !isSearching && (
                <div className="friend-invite-modal-search-results">
                  <div className="friend-invite-modal-search-empty">
                    검색 결과가 없습니다.
                  </div>
                </div>
              )}
          </div>

          {selectedFriends.length > 0 && (
            <div className="friend-invite-modal-selected">
              <div className="friend-invite-modal-selected-label">선택된 친구</div>
              <div className="friend-invite-modal-chips">
                {selectedFriends.map((friend) => (
                  <div key={friend.id} className="friend-invite-modal-chip">
                    <span className="friend-invite-modal-chip-name">
                      {friend.nickname}
                    </span>
                    <button
                      className="friend-invite-modal-chip-remove"
                      onClick={() => handleRemoveFriend(friend.id)}
                      aria-label="제거"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="friend-invite-modal-footer">
          <button
            className="friend-invite-modal-cancel-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            className="friend-invite-modal-submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || selectedFriends.length === 0}
          >
            {isSubmitting ? "초대 중..." : "초대하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

