import React from 'react';
import { UserInfo } from '../../services/authService';
import AccountManagement from './AccountManagement';
import { LogoutButton } from '../../components/layout';
import { ThemeSelector } from '../../components/common';

interface AdminPanelProps {
  currentUser: UserInfo;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onLogout }) => {

  return (
    <div className="glassmorphism-user-container glassmorphism-admin-container">
      {/* Header */}
      <div className="glassmorphism-container">
        <div className="glassmorphism-header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="glassmorphism-title">Pannello Amministratore</h1>
              <p className="glassmorphism-subtitle">Benvenuto, {currentUser.username}</p>
            </div>
            <div className="flex align-items-center gap-2">
              <ThemeSelector />
              <LogoutButton onLogout={onLogout} className="glassmorphism-logout" />
            </div>
          </div>
        </div>

        {/* Gestione Account */}
        <AccountManagement />
      </div>
    </div>
  );
};

export default AdminPanel;