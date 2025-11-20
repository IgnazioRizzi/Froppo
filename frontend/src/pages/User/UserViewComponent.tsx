import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { UserInfo } from '../../services/authService';
import { userService } from '../../services/userService';
import { excelService } from '../../services/excelService';
import { User } from '../../types/User';
import { LogoutButton } from '../../components/layout';
import { ActionMenu, ToastContainer, ThemeSelector } from '../../components/common';
import { UserFormDialog } from '../../components/forms';
import { useToast } from '../../hooks/useToast';

interface UserViewProps {
  currentUser: UserInfo;
  onLogout: () => void;
}

const UserView: React.FC<UserViewProps> = ({ currentUser, onLogout }) => {
  const { toasts, addToast, removeToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt'>('name');
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [showUserFormDialog, setShowUserFormDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Errore nel caricamento degli utenti',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleExportExcel = async () => {
    if (selectedUsers.length === 0) {
      addToast({
        type: 'info',
        message: 'Seleziona almeno un utente per esportare',
        duration: 4000
      });
      return;
    }
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    await excelService.exportUsersWithPDFs(selectedUsers, { filename: `utenti-selezionati-${timestamp}.zip` });
    addToast({
      type: 'success',
      message: `${selectedUsers.length} utenti esportati con PDF in archivio ZIP`,
      duration: 5000
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      addToast({
        type: 'info',
        message: 'Seleziona almeno un utente per eliminare',
        duration: 4000
      });
      return;
    }

    try {
      for (const user of selectedUsers) {
        await userService.deleteUser(user.id);
      }
      addToast({
        type: 'success',
        message: `${selectedUsers.length} utenti eliminati con successo`,
        duration: 5000
      });
      loadUsers();
      setSelectedUsers([]);
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Errore durante l\'eliminazione',
        duration: 5000
      });
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserFormDialog(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowUserFormDialog(true);
  };

  const handleUserSubmit = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, userData);
        addToast({
          type: 'success',
          message: 'Dipendente aggiornato con successo',
          duration: 4000
        });
      } else {
        // Aggiungi userId per la creazione
        const userDataWithUserId = {
          ...userData,
          userId: currentUser.id.toString()
        };
        await userService.createUser(userDataWithUserId);
        addToast({
          type: 'success',
          message: 'Dipendente creato con successo',
          duration: 4000
        });
      }
      await loadUsers();
      setShowUserFormDialog(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error in handleUserSubmit:', error);
      addToast({
        type: 'error',
        message: 'Errore durante il salvataggio',
        duration: 5000
      });
    }
  };

  const handleDeleteUser = (user: any) => {
    // Mostra conferma e poi elimina
    confirmDeleteUser(user);
  };

  const confirmDeleteUser = async (user: any) => {
    try {
      await userService.deleteUser(user.id);
      addToast({
        type: 'success',
        message: 'Utente eliminato con successo',
        duration: 4000
      });
      loadUsers();
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Errore durante l\'eliminazione',
        duration: 5000
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case 'email':
        return a.email?.localeCompare(b.email) || 0;
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const actionBodyTemplate = (user: any) => {
    return (
      <ActionMenu
        onEdit={() => handleEditUser(user)}
        onDelete={() => handleDeleteUser(user)}
      />
    );
  };

  const sortOptions = [
    { label: 'Nome', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Data Creazione', value: 'createdAt' }
  ];

  return (
    <div className="glassmorphism-user-container">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog />
      
      <div className="glassmorphism-container">
        {/* Header */}
        <div className="glassmorphism-header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="glassmorphism-title">Gestione Dipendenti</h1>
              <p className="glassmorphism-subtitle">Benvenuto, {currentUser.username}</p>
            </div>
            <div className="flex align-items-center gap-2">
              <ThemeSelector />
              <LogoutButton onLogout={onLogout} className="glassmorphism-logout" />
            </div>
          </div>
        </div>

        {/* Filtri e Azioni */}
        <div className="glassmorphism-card">
        <div className="glassmorphism-card-content">
          <div className="filters-section">
            <div className="search-group">
              <label htmlFor="search" className="glassmorphism-label">
                Cerca dipendenti
              </label>
              <div className="glassmorphism-input-group">
                <div className="input-icon">
                  <i className="pi pi-search"></i>
                </div>
                <InputText
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome, cognome o email..."
                  className="glassmorphism-input"
                />
                <div className="input-underline"></div>
              </div>
            </div>
            
            <div className="sort-group">
              <label htmlFor="sort" className="glassmorphism-label">
                Ordina per
              </label>
              <Dropdown
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.value)}
                options={sortOptions}
                className="glassmorphism-dropdown"
                placeholder="Seleziona ordinamento"
              />
            </div>
          </div>

          <div className="actions-section">
            <Button
              label="Nuovo Dipendente"
              icon="pi pi-plus"
              onClick={handleCreateUser}
              className="glassmorphism-button"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="glassmorphism-bulk-actions">
            <div className="bulk-actions-content">
              <span className="bulk-actions-text">
                {selectedUsers.length} elemento{selectedUsers.length !== 1 ? 'i' : ''} selezionato{selectedUsers.length !== 1 ? 'i' : ''}
              </span>
              
              <Button
                label="Esporta con PDF"
                icon="pi pi-download"
                onClick={handleExportExcel}
                size="small"
                className="glassmorphism-button-secondary"
              />
              
              <Button
                label="Elimina Selezionati"
                icon="pi pi-trash"
                onClick={handleDeleteSelected}
                size="small"
                className="glassmorphism-button-danger"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabella Dipendenti */}
      <div className="glassmorphism-card">
        <div className="glassmorphism-table-container">
          <DataTable
            value={sortedUsers}
            loading={loading}
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage="Nessun dipendente trovato"
            className="glassmorphism-datatable"
            selectionMode="checkbox"
            metaKeySelection={false}
          >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
          <Column 
            header="Avatar" 
            body={(user) => (
              <Avatar 
                label={`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
                className="bg-primary text-white"
                size="normal"
                shape="circle"
              />
            )}
            headerStyle={{ width: '5rem' }}
          />
          <Column 
            field="firstName" 
            header="Nome" 
            sortable
            body={(user) => `${user.firstName} ${user.lastName}`}
          />
          <Column field="email" header="Email" sortable />
          <Column 
            field="dateOfBirth" 
            header="Data di Nascita" 
            sortable
            body={(user) => user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('it-IT') : '-'}
          />
          <Column 
            field="placeOfBirth" 
            header="Luogo di Nascita"
            body={(user) => user.placeOfBirth || '-'}
          />
          <Column 
            field="residence" 
            header="Residenza"
            body={(user) => user.residence || '-'}
          />
          <Column 
            field="createdAt" 
            header="Data Creazione" 
            sortable
            body={(user) => new Date(user.createdAt).toLocaleDateString('it-IT')}
          />
          <Column header="Azioni" body={actionBodyTemplate} headerStyle={{ width: '8rem' }} />
          </DataTable>
        </div>
      </div>

      <UserFormDialog
        visible={showUserFormDialog}
        onHide={() => setShowUserFormDialog(false)}
        onSubmit={handleUserSubmit}
        user={editingUser}
        title={editingUser ? 'Modifica Dipendente' : 'Nuovo Dipendente'}
      />
      </div>
    </div>
  );
};

export default UserView;
