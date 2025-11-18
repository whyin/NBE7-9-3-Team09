import React, { useState, useEffect, useRef } from "react";
import { searchFriends } from "../../services/friendService";
import "./FriendInvitePanel.css";

export default function FriendInvitePanel({ selectedFriends = [], onFriendsChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchRef = useRef(null);

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

  // 외부 클릭 시 검색 결과 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddFriend = (friend) => {
    if (!selectedFriends.some((sf) => sf.id === friend.id)) {
      const newSelected = [...selectedFriends, friend];
      onFriendsChange(newSelected);
      setSearchQuery("");
      setShowResults(false);
    }
  };

  const handleRemoveFriend = (friendId) => {
    const newSelected = selectedFriends.filter((sf) => sf.id !== friendId);
    onFriendsChange(newSelected);
  };

  const getAvatarInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="friend-invite-panel">
      <div className="friend-invite-header">
        <h3 className="friend-invite-title">👥 친구 초대</h3>
        <p className="friend-invite-subtitle">함께 여행할 친구를 추가해보세요</p>
      </div>

      <div className="friend-invite-search" ref={searchRef}>
        <input
          type="text"
          className="friend-invite-search-input"
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
          <div className="friend-invite-search-loading">검색 중...</div>
        )}
        {showResults && searchResults.length > 0 && (
          <div className="friend-invite-search-results">
            {searchResults.map((friend) => (
              <div
                key={friend.id}
                className="friend-invite-search-result-item"
                onClick={() => handleAddFriend(friend)}
              >
                <div className="friend-invite-avatar">
                  {friend.profileImage ? (
                    <img
                      src={friend.profileImage}
                      alt={friend.nickname}
                      className="friend-invite-avatar-img"
                    />
                  ) : (
                    <span className="friend-invite-avatar-initial">
                      {getAvatarInitial(friend.nickname)}
                    </span>
                  )}
                </div>
                <div className="friend-invite-result-info">
                  <div className="friend-invite-result-name">{friend.nickname}</div>
                  <div className="friend-invite-result-email">{friend.email}</div>
                </div>
                <button
                  className="friend-invite-add-btn"
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
        {showResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
          <div className="friend-invite-search-results">
            <div className="friend-invite-search-empty">검색 결과가 없습니다.</div>
          </div>
        )}
      </div>

      {selectedFriends.length > 0 && (
        <div className="friend-invite-selected">
          <div className="friend-invite-selected-label">선택된 친구</div>
          <div className="friend-invite-chips">
            {selectedFriends.map((friend) => (
              <div key={friend.id} className="friend-invite-chip">
                <span className="friend-invite-chip-name">{friend.nickname}</span>
                <button
                  className="friend-invite-chip-remove"
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

      <div className="friend-invite-hint">
        * 계획 생성 후에도 친구를 추가하거나 삭제할 수 있습니다.
      </div>
    </div>
  );
}

