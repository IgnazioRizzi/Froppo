import React from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'company', label: 'Company', icon: '🏢' },
    { id: 'people', label: 'People', icon: '👥' },
    { id: 'expenses', label: 'Expenses', icon: '💰' },
    { id: 'assets', label: 'Assets', icon: '📦' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'recruiting', label: 'Recruiting', icon: '🔍' },
    { id: 'hr', label: 'HR', icon: '👤' },
    { id: 'sales', label: 'Sales', icon: '🛒' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'admin', label: 'Admin', icon: '⚙️' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">PMG</span>
          <span className="logo-suffix">list</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
