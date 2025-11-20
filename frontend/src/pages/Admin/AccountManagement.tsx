import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Tag } from 'primereact/tag';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { StandardDialog } from '../../components/common';
import { accountService, UserAccount, CreateAccountRequest } from '../../services/accountService';
import { ActionMenu, RoleMenu } from '../../components/common';

const AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'username' | 'email' | 'role' | 'createdAt'>('username');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedAccounts, setSelectedAccounts] = useState<UserAccount[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAccount, setNewAccount] = useState<CreateAccountRequest>({
    username: '',
    email: '',
    password: '',
    role: 'User'
  });

  const roleOptions = [
    { label: 'Utente', value: 'User' },
    { label: 'Amministratore', value: 'Admin' }
  ];

  const availableRoles = [
    { value: 'all', label: 'Tutti', color: 'info' },
    { value: 'Admin', label: 'Admin', color: 'danger' },
    { value: 'User', label: 'Utente', color: 'success' }
  ];

  const sortOptions = [
    { label: 'Username', value: 'username' },
    { label: 'Email', value: 'email' },
    { label: 'Ruolo', value: 'role' },
    { label: 'Data Creazione', value: 'createdAt' }
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showToast = useCallback((severity: 'success' | 'error' | 'info' | 'warn', message: string) => {
    if (toast) {
      toast.show({ severity, summary: severity.charAt(0).toUpperCase() + severity.slice(1), detail: message, life: 3000 });
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const accountsData = await accountService.getAllAccounts();
      setAccounts(accountsData);
    } catch (error: any) {
      showToast('error', error.message || 'Errore nel caricamento degli account');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);


  const filteredAndSortedAccounts = accounts
    .filter(account => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        account.username.toLowerCase().includes(searchLower) ||
        account.email.toLowerCase().includes(searchLower) ||
        account.role.toLowerCase().includes(searchLower)
      );
      
      // Filtro per ruolo (se non è 'all')
      const matchesRole = selectedRole === 'all' || account.role === selectedRole;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'username':
          return a.username.localeCompare(b.username);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const handleCreateAccount = async () => {
    try {
      if (!newAccount.username || !newAccount.email || !newAccount.password) {
        showToast('error', 'Tutti i campi sono obbligatori');
        return;
      }

      await accountService.createAccount(newAccount);
      showToast('success', 'Account creato con successo');
      setShowCreateDialog(false);
      setNewAccount({ username: '', email: '', password: '', role: 'User' });
      loadAccounts();
    } catch (error: any) {
      showToast('error', error.message || 'Errore nella creazione dell\'account');
    }
  };


  const handleDeleteSelected = async () => {
    try {
      for (const account of selectedAccounts) {
        await accountService.deleteAccount(account.id);
      }
      showToast('success', `${selectedAccounts.length} account eliminati con successo`);
      setSelectedAccounts([]);
      loadAccounts();
    } catch (error: any) {
      showToast('error', error.message || 'Errore nell\'eliminazione degli account');
    }
  };

  const statusBodyTemplate = (account: UserAccount) => {
    return (
      <div className="p-2">
        <Tag 
          value={account.isActive ? 'Attivo' : 'Bloccato'} 
          severity={account.isActive ? 'success' : 'danger'} 
        />
      </div>
    );
  };

  const roleBodyTemplate = (account: UserAccount) => {
    const getRoleInfo = (role: string) => {
      switch (role) {
        case 'Admin':
          return { label: 'Admin', color: 'danger', icon: 'pi-shield' };
        case 'User':
          return { label: 'Utente', color: 'success', icon: 'pi-user' };
        default:
          return { label: 'Sconosciuto', color: 'secondary', icon: 'pi-question' };
      }
    };

    const roleInfo = getRoleInfo(account.role);
    
    return (
      <div className="flex align-items-center gap-2">
        <i className={`pi ${roleInfo.icon} text-${roleInfo.color}`} style={{ fontSize: '0.9rem' }}></i>
        <span className={`text-${roleInfo.color} font-semibold`}>{roleInfo.label}</span>
      </div>
    );
  };

  const dateBodyTemplate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  const actionBodyTemplate = (account: UserAccount) => {
    return (
      <ActionMenu
        onEdit={() => {
          // Implementa modifica account se necessario
          showToast('info', `Modifica account per ${account.username}`);
        }}
        onDelete={async () => {
          try {
            await accountService.deleteAccount(account.id);
            showToast('success', 'Account eliminato con successo');
            await loadAccounts();
          } catch (error: any) {
            showToast('error', error.message || 'Errore durante l\'eliminazione');
          }
        }}
        onView={async () => {
          try {
            await accountService.toggleAccountStatus(account.id);
            const action = account.isActive ? 'bloccato' : 'sbloccato';
            showToast('success', `Account ${action} con successo`);
            await loadAccounts();
          } catch (error: any) {
            showToast('error', error.message || 'Errore durante il cambio stato');
          }
        }}
        showView={true}
        viewLabel={account.isActive ? 'Blocca' : 'Sblocca'}
        viewIcon={account.isActive ? 'pi pi-ban' : 'pi pi-check'}
        size="small"
        variant="text"
      />
    );
  };


  return (
    <>
      <Toast ref={setToast} />
      <ConfirmDialog />

      {/* Filtri e Azioni */}
      <div className="glassmorphism-card">
        <div className="glassmorphism-card-content">
          <div className="filters-section">
            <div className="search-group">
              <label htmlFor="search-accounts" className="glassmorphism-label">
                Cerca account
              </label>
              <div className="glassmorphism-input-group">
                <div className="input-icon">
                  <i className="pi pi-search"></i>
                </div>
                <InputText
                  id="search-accounts"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Username, email o ruolo..."
                  className="glassmorphism-input"
                />
                <div className="input-underline"></div>
              </div>
            </div>
            
            <div className="sort-group">
              <label htmlFor="sort-accounts" className="glassmorphism-label">
                Ordina per
              </label>
              <Dropdown
                id="sort-accounts"
                value={sortBy}
                onChange={(e) => setSortBy(e.value)}
                options={sortOptions}
                className="glassmorphism-dropdown"
                placeholder="Seleziona ordinamento"
              />
            </div>

            <div className="sort-group">
              <label htmlFor="filter-role" className="glassmorphism-label">
                Filtra per ruolo
              </label>
              <RoleMenu
                currentRole={selectedRole}
                onRoleChange={setSelectedRole}
                availableRoles={availableRoles}
                size="small"
              />
            </div>
          </div>

          <div className="actions-section">
            <Button
              label="Nuovo Account"
              icon="pi pi-plus"
              onClick={() => setShowCreateDialog(true)}
              className="glassmorphism-button"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAccounts.length > 0 && (
          <div className="glassmorphism-bulk-actions">
            <div className="bulk-actions-content">
              <span className="bulk-actions-text">
                {selectedAccounts.length} elemento{selectedAccounts.length !== 1 ? 'i' : ''} selezionato{selectedAccounts.length !== 1 ? 'i' : ''}
              </span>
              
              <Button
                label={`Elimina (${selectedAccounts.length})`}
                icon="pi pi-trash"
                onClick={() => {
                  if (window.confirm(`Sei sicuro di voler eliminare ${selectedAccounts.length} account?`)) {
                    handleDeleteSelected();
                  }
                }}
                className="glassmorphism-button-danger"
                size="small"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabella Account */}
      <div className="glassmorphism-card">
        <div className="glassmorphism-table-container">
          <DataTable
            value={filteredAndSortedAccounts}
            selection={selectedAccounts}
            onSelectionChange={(e) => setSelectedAccounts(e.value)}
            dataKey="id"
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            emptyMessage="Nessun account trovato"
            className="glassmorphism-datatable"
            selectionMode="multiple"
            metaKeySelection={false}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column field="username" header="Username" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="role" header="Ruolo" body={roleBodyTemplate} sortable />
            <Column field="isActive" header="Stato" body={statusBodyTemplate} sortable />
            <Column 
              field="createdAt" 
              header="Data Creazione" 
              sortable 
              body={(account) => dateBodyTemplate(account.createdAt)}
            />
            <Column 
              field="lastLoginAt" 
              header="Ultimo Accesso" 
              body={(account) => dateBodyTemplate(account.lastLoginAt)}
            />
            <Column header="Azioni" body={actionBodyTemplate} />
          </DataTable>
        </div>
      </div>

      <StandardDialog
        visible={showCreateDialog}
        onHide={() => setShowCreateDialog(false)}
        title="Crea Nuovo Account"
        style={{ width: '500px', minWidth: '400px' }}
        className="create-account-dialog"
      >
        <div className="p-4">
          <div className="flex align-items-center mb-4">
            <i className="pi pi-user-plus text-2xl text-blue-500 mr-3"></i>
            <div>
              <h4 className="m-0 mb-1">Nuovo Account</h4>
              <p className="text-600 m-0 text-sm">Crea un nuovo account di accesso al sistema</p>
            </div>
          </div>

          <div className="p-fluid">
            <div className="field mb-4">
              <label htmlFor="username" className="font-semibold text-900 mb-2 block">Username</label>
              <span className="p-input-icon-left w-full">
                <i className="pi pi-user" />
                <InputText
                  id="username"
                  value={newAccount.username}
                  onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                  placeholder="Inserisci username"
                  className="w-full"
                />
              </span>
            </div>
            
            <div className="field mb-4">
              <label htmlFor="email" className="font-semibold text-900 mb-2 block">Email</label>
              <span className="p-input-icon-left w-full">
                <i className="pi pi-envelope" />
                <InputText
                  id="email"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                  placeholder="Inserisci email"
                  className="w-full"
                />
              </span>
            </div>
            
            <div className="field mb-4">
              <label htmlFor="password" className="font-semibold text-900 mb-2 block">Password</label>
              <Password
                id="password"
                value={newAccount.password}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                placeholder="Inserisci password"
                toggleMask
                className="w-full"
                inputClassName="w-full"
                feedback={false}
              />
            </div>
            
            <div className="field mb-4">
              <label htmlFor="role" className="font-semibold text-900 mb-2 block">Ruolo</label>
              <Dropdown
                id="role"
                value={newAccount.role}
                options={roleOptions}
                onChange={(e) => setNewAccount({ ...newAccount, role: e.value })}
                placeholder="Seleziona ruolo"
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-content-end gap-2 p-4 border-top-1 surface-border">
          <Button
            label="Annulla"
            icon="pi pi-times"
            onClick={() => setShowCreateDialog(false)}
            className="p-button-text"
            size="small"
          />
          <Button
            label="Crea Account"
            icon="pi pi-check"
            onClick={handleCreateAccount}
            className="p-button-success"
            size="small"
          />
        </div>
      </StandardDialog>
    </>
  );
};

export default AccountManagement;
