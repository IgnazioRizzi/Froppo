import React from 'react';

interface HeaderProps {
  title: string;
  userName: string;
  userAvatar?: string;
}

const Header: React.FC<HeaderProps> = ({ title, userName, userAvatar }) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>
      
      <div className="header-right">
        <div className="header-actions">
          <button className="header-btn" title="Messages">
            <span className="icon">✉️</span>
          </button>
          <button className="header-btn" title="Notifications">
            <span className="icon">🔔</span>
          </button>
        </div>
        
        <div className="user-profile">
          <div className="user-avatar">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} />
            ) : (
              <span className="avatar-placeholder">👤</span>
            )}
          </div>
          <span className="user-name">{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
