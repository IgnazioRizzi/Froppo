import React from 'react';
import { Toast } from '../../hooks/useToast';

interface ToastComponentProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return 'pi pi-check-circle';
      case 'error':
        return 'pi pi-times-circle';
      case 'warning':
        return 'pi pi-exclamation-triangle';
      case 'info':
        return 'pi pi-info-circle';
      default:
        return 'pi pi-info-circle';
    }
  };

  const getToastClass = () => {
    return `glassmorphism-toast glassmorphism-toast-${toast.type}`;
  };

  return (
    <div className={getToastClass()}>
      <div className="toast-content">
        <div className="toast-icon">
          <i className={getIcon()}></i>
        </div>
        <div className="toast-message">
          {toast.message}
        </div>
        <button
          className="toast-close"
          onClick={() => onRemove(toast.id)}
          type="button"
        >
          <i className="pi pi-times"></i>
        </button>
      </div>
      <div className="toast-progress">
        <div className="toast-progress-bar"></div>
      </div>
    </div>
  );
};

export default ToastComponent;
