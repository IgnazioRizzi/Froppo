import React from 'react';
import { SplitButton } from 'primereact/splitbutton';

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onExport?: () => void;
  showExport?: boolean;
  size?: 'small' | 'large';
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onDelete,
  onExport,
  showExport = false,
  size = 'small'
}) => {
  if (selectedCount === 0) {
    return null;
  }

  const items = [
    {
      label: 'Elimina Selezionati',
      icon: 'pi pi-trash',
      command: onDelete,
      className: 'p-button-danger'
    }
  ];

  if (showExport && onExport) {
    items.unshift({
      label: 'Esporta con PDF',
      icon: 'pi pi-download',
      command: onExport,
      className: ''
    });
  }

  return (
    <div className="flex align-items-center gap-2">
      <span className="text-sm text-600">
        {selectedCount} elemento{selectedCount !== 1 ? 'i' : ''} selezionato{selectedCount !== 1 ? 'i' : ''}
      </span>
      
      <SplitButton
        label="Azioni"
        icon="pi pi-cog"
        model={items}
        size={size}
        severity="secondary"
        className="p-button-outlined"
      />
    </div>
  );
};

export default BulkActions;

