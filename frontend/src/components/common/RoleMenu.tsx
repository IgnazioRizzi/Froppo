import React from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';

interface RoleMenuProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  availableRoles: { value: string; label: string; color: string }[];
  disabled?: boolean;
  size?: 'small' | 'normal' | 'large';
}

const RoleMenu: React.FC<RoleMenuProps> = ({
  currentRole,
  onRoleChange,
  availableRoles,
  disabled = false,
  size = 'normal'
}) => {
  const menuRef = React.useRef<Menu>(null);

  const getCurrentRoleInfo = () => {
    return availableRoles.find(role => role.value === currentRole) || availableRoles[0];
  };

  const currentRoleInfo = getCurrentRoleInfo();

  const items: MenuItem[] = availableRoles.map(role => ({
    label: role.label,
    icon: `pi pi-${role.color === 'danger' ? 'shield' : role.color === 'success' ? 'user' : 'users'}`,
    command: () => onRoleChange(role.value),
    disabled: role.value === currentRole,
    className: `role-menu-item role-${role.value.toLowerCase()}`
  }));

  const getButtonClass = () => {
    let baseClass = 'p-button-outlined';
    
    if (disabled) {
      baseClass += ' p-disabled';
    }
    
    return baseClass;
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return 'small' as const;
      case 'large':
        return 'large' as const;
      default:
        return undefined;
    }
  };

  return (
    <>
      <div className="flex align-items-center gap-2">
        <Button
          label={currentRoleInfo.label}
          icon={`pi pi-${currentRoleInfo.color === 'danger' ? 'shield' : currentRoleInfo.color === 'success' ? 'user' : 'users'}`}
          className={getButtonClass()}
          size={getButtonSize()}
          onClick={(e) => !disabled && menuRef.current?.toggle(e)}
          disabled={disabled}
          tooltip="Cambia ruolo"
          tooltipOptions={{ position: 'bottom' }}
        />
        <i className="pi pi-chevron-down" style={{ fontSize: '0.7rem', color: '#6c757d' }}></i>
      </div>
      <Menu
        ref={menuRef}
        model={items}
        popup
        className="role-menu"
      />
    </>
  );
};

export default RoleMenu;
