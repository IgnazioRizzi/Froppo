import React from 'react';
import { Dialog } from 'primereact/dialog';
import { User } from '../../types/User';
import UserForm from './UserForm';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../common';

interface UserFormDialogProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  user?: User | null;
  title?: string;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  visible,
  onHide,
  onSubmit,
  user = null,
  title = 'Gestione Dipendente'
}) => {
  const { toasts, addToast, removeToast } = useToast();

  const handleSubmit = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      await onSubmit(userData);
      addToast({
        type: 'success',
        message: user ? 'Dipendente aggiornato con successo!' : 'Dipendente creato con successo!',
        duration: 4000
      });
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      addToast({
        type: 'error',
        message: 'Errore durante il salvataggio del dipendente',
        duration: 5000
      });
      throw error; // Rilancia l'errore per gestirlo nel componente padre
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header={title}
        style={{ width: '90vw', maxWidth: '800px' }}
        className="glassmorphism-dialog"
        modal
        draggable={false}
        resizable={false}
        blockScroll
        dismissableMask
        closeOnEscape
      >
        <div className="glassmorphism-form-container">
          <UserForm
            user={user}
            onSubmit={handleSubmit}
            onCancel={onHide}
          />
        </div>
      </Dialog>
    </>
  );
};

export default UserFormDialog;
