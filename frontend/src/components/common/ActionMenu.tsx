import React from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onView?: () => void;
  onDuplicate?: () => void;
  onExport?: () => void;
  showView?: boolean;
  showDuplicate?: boolean;
  showExport?: boolean;
  viewLabel?: string;
  viewIcon?: string;
  size?: 'small' | 'normal' | 'large';
  variant?: 'text' | 'outlined' | 'contained';
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onExport,
  showView = false,
  showDuplicate = false,
  showExport = false,
  viewLabel = 'Visualizza',
  viewIcon = 'pi pi-eye',
  size = 'small',
  variant = 'text'
}) => {
  const menuRef = React.useRef<Menu>(null);

  const items: MenuItem[] = [
    ...(showView && onView ? [{
      label: viewLabel,
      icon: viewIcon,
      command: onView
    }] : []),
    {
      label: 'Modifica',
      icon: 'pi pi-pencil',
      command: onEdit
    },
    ...(showDuplicate && onDuplicate ? [{
      label: 'Duplica',
      icon: 'pi pi-copy',
      command: onDuplicate
    }] : []),
    ...(showExport && onExport ? [{
      label: 'Esporta',
      icon: 'pi pi-download',
      command: onExport
    }] : []),
    {
      separator: true
    },
    {
      label: 'Elimina',
      icon: 'pi pi-trash',
      command: onDelete,
      className: 'p-menuitem-danger'
    }
  ];

  const getButtonClass = () => {
    let baseClass = 'p-button-rounded p-button-sm';
    
    if (variant === 'text') {
      baseClass += ' p-button-text';
    } else if (variant === 'outlined') {
      baseClass += ' p-button-outlined';
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
      <Button
        icon="pi pi-ellipsis-v"
        className={getButtonClass()}
        size={getButtonSize()}
        onClick={(e) => menuRef.current?.toggle(e)}
        tooltip="Azioni"
        tooltipOptions={{ position: 'left' }}
      />
      <Menu
        ref={menuRef}
        model={items}
        popup
        className="action-menu"
      />
    </>
  );
};

export default ActionMenu;