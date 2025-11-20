import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { User } from '../../types/User';

// Helper function per formattare le date
const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

interface ModernTableViewProps {
  users: User[];
  selectionMode: boolean;
  selectedIds: Set<number>;
  onToggleSelection: (id: number) => void;
  onSelectAll: () => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  isSubmitting: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: 'name' | 'email' | 'createdAt';
  onSortByChange: (sortBy: 'name' | 'email' | 'createdAt') => void;
  onExport: () => void;
  onDeleteSelected: () => void;
  onAddNew: () => void;
}

const ModernTableView: React.FC<ModernTableViewProps> = ({
  users,
  selectionMode,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  onEdit,
  onDelete,
  isSubmitting,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortByChange,
  onExport,
  onDeleteSelected,
  onAddNew
}) => {
  const isSelected = (id: number) => selectedIds.has(id);
  const allSelected = users.length > 0 && users.every(user => isSelected(user.id));
  const someSelected = users.some(user => isSelected(user.id));

  // Template per nome utente
  const nameBodyTemplate = (user: User) => {
    return (
      <div className="flex align-items-center gap-2">
        <div className="flex align-items-center justify-content-center bg-primary text-primary-50 border-circle" 
             style={{ width: '2rem', height: '2rem', fontSize: '0.875rem', fontWeight: '600' }}>
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </div>
        <div>
          <div className="font-semibold">{user.firstName} {user.lastName}</div>
          <div className="text-sm text-600">Dipendente</div>
        </div>
      </div>
    );
  };

  // Template per azioni
  const actionBodyTemplate = (user: User) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          size="small"
          severity="secondary"
          onClick={() => onEdit(user)}
          tooltip="Modifica"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon="pi pi-trash"
          size="small"
          severity="danger"
          onClick={() => onDelete(user.id)}
          disabled={isSubmitting}
          tooltip="Elimina"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  // Template per checkbox di selezione
  const selectionBodyTemplate = (user: User) => {
    return (
      <Checkbox
        checked={isSelected(user.id)}
        onChange={() => onToggleSelection(user.id)}
      />
    );
  };

  // Template per header checkbox
  const selectionHeaderTemplate = () => {
    return (
      <Checkbox
        checked={allSelected}
        onChange={onSelectAll}
      />
    );
  };

  // Opzioni per il dropdown di ordinamento
  const sortOptions = [
    { label: 'Nome', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Data Creazione', value: 'createdAt' }
  ];

  return (
    <div className="card">
      {/* Toolbar Mobile-Friendly */}
      <div className="flex flex-column md:flex-row gap-3 mb-4">
        {/* Search e Sort */}
        <div className="flex flex-column sm:flex-row gap-2 flex-1">
          <div className="p-input-icon-left flex-1">
            <i className="pi pi-search" />
            <InputText
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cerca dipendenti..."
              className="w-full"
            />
          </div>
          <Dropdown
            value={sortBy}
            onChange={(e) => onSortByChange(e.value)}
            options={sortOptions}
            placeholder="Ordina per"
            className="w-full sm:w-auto"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            icon="pi pi-download"
            label="Export"
            onClick={onExport}
            size="small"
            severity="secondary"
            className="flex-1 sm:flex-none"
          />
          {someSelected && (
            <Button
              icon="pi pi-trash"
              label="Elimina Selezionati"
              onClick={onDeleteSelected}
              size="small"
              severity="danger"
              className="flex-1 sm:flex-none"
            />
          )}
          <Button
            icon="pi pi-plus"
            label="Aggiungi"
            onClick={onAddNew}
            size="small"
            className="flex-1 sm:flex-none"
          />
        </div>
      </div>

      {/* DataTable Mobile-Responsive */}
      <DataTable
        value={users}
        dataKey="id"
        emptyMessage="Nessun dipendente trovato"
        className="p-datatable-sm"
        responsiveLayout="scroll"
        breakpoint="960px"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} di {totalRecords} dipendenti"
      >
        {selectionMode && (
          <Column
            selectionMode="multiple"
            headerStyle={{ width: '3rem' }}
            body={selectionBodyTemplate}
            header={selectionHeaderTemplate}
          />
        )}
        
        <Column
          field="firstName"
          header="Nome"
          body={nameBodyTemplate}
          sortable
          style={{ minWidth: '200px' }}
        />
        
        <Column
          field="email"
          header="Email"
          sortable
          style={{ minWidth: '200px' }}
        />
        
        <Column
          field="createdAt"
          header="Data Creazione"
          body={(user: User) => formatDate(user.createdAt)}
          sortable
          style={{ minWidth: '150px' }}
        />
        
        <Column
          header="Azioni"
          body={actionBodyTemplate}
          style={{ width: '120px' }}
          align="center"
        />
      </DataTable>
    </div>
  );
};

export default ModernTableView;