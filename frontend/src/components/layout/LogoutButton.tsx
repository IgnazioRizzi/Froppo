import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

interface LogoutButtonProps {
  onLogout: () => void;
  username?: string;
  className?: string;
  size?: 'small' | 'large';
  variant?: 'text' | 'outlined' | 'filled';
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  onLogout, 
  username, 
  className = '', 
  size = 'small',
  variant = 'text'
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowConfirm(false);
    onLogout();
    toast?.show({
      severity: 'success',
      summary: 'Logout',
      detail: 'Logout effettuato con successo',
      life: 2000
    });
  };

  const getButtonProps = () => {
    const baseProps = {
      icon: 'pi pi-sign-out',
      onClick: handleLogoutClick,
      className: `p-button-${variant} logout-button ${className}`,
      size: size as any
    };

    if (variant === 'text') {
      return {
        ...baseProps,
        label: username ? `Logout (${username})` : 'Logout',
        tooltip: 'Esci dall\'applicazione'
      };
    }

    return {
      ...baseProps,
      label: 'Logout',
      tooltip: username ? `Esci come ${username}` : 'Esci dall\'applicazione'
    };
  };

  return (
    <>
      <Toast ref={setToast} />
      <ConfirmDialog
        visible={showConfirm}
        onHide={() => setShowConfirm(false)}
        message={
          <div className="flex align-items-center">
            <i className="pi pi-exclamation-triangle text-orange-500 text-2xl mr-3"></i>
            <div>
              <p className="m-0 mb-2 font-semibold">Conferma Logout</p>
              <p className="m-0 text-600">Sei sicuro di voler effettuare il logout?</p>
              {username && (
                <p className="m-0 mt-2 text-sm text-500">Utente: <strong>{username}</strong></p>
              )}
            </div>
          </div>
        }
        header=""
        icon=""
        acceptLabel="Sì, esci"
        rejectLabel="Annulla"
        acceptClassName="p-button-danger"
        rejectClassName="p-button-text"
        accept={handleConfirmLogout}
        reject={() => setShowConfirm(false)}
        className="logout-confirm-dialog"
      />
      <Button {...getButtonProps()} />
    </>
  );
};

export default LogoutButton;
