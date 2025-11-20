import React, { useState } from 'react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: 'name' | 'email' | 'createdAt';
  onSortByChange: (sortBy: 'name' | 'email' | 'createdAt') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  resultCount: number;
  totalCount: number;
  viewMode: 'cards' | 'list';
  onViewModeChange: (mode: 'cards' | 'list') => void;
  selectionMode: boolean;
  onToggleSelection: () => void;
  selectedCount: number;
  onAddUser: () => void;
  onExportExcel: () => void;
  onExportCSV: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
  disabled?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  resultCount,
  totalCount,
  viewMode,
  onViewModeChange,
  selectionMode,
  onToggleSelection,
  selectedCount,
  onAddUser,
  onExportExcel,
  onExportCSV,
  onDeleteSelected,
  onClearSelection,
  disabled = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="filter-bar">
      <div className="filter-main">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cerca utenti..."
            className="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear"
              onClick={() => onSearchChange('')}
              title="Cancella ricerca"
            >
              ✕
            </button>
          )}
        </div>

        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => onViewModeChange('cards')}
            title="Vista a card"
          >
            ⊞
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="Vista a lista"
          >
            ☰
          </button>
        </div>

        <div className="action-buttons">
          <button
            className="action-btn primary"
            onClick={onAddUser}
            disabled={disabled}
            title="Aggiungi utente"
          >
            ➕ Aggiungi
          </button>
          
          <button
            className={`action-btn ${selectionMode ? 'active' : ''}`}
            onClick={onToggleSelection}
            disabled={disabled}
            title="Modalità selezione"
          >
            {selectionMode ? '✕ Esci' : '☑️ Seleziona'}
          </button>
        </div>

        <button
          className="filter-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span className="filter-icon">⚙️</span>
          Filtri
          <span className="toggle-arrow">{showAdvanced ? '▲' : '▼'}</span>
        </button>
      </div>

      {showAdvanced && (
        <div className="filter-advanced">
          <div className="filter-group">
            <label>Ordina per</label>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as 'name' | 'email' | 'createdAt')}
              className="filter-select"
            >
              <option value="name">Nome</option>
              <option value="email">Email</option>
              <option value="createdAt">Data creazione</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Ordine</label>
            <select
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
              className="filter-select"
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>

          <div className="filter-results">
            <span className="results-text">
              Mostrando <strong>{resultCount}</strong> di <strong>{totalCount}</strong> utenti
              {searchTerm && ` per "${searchTerm}"`}
            </span>
          </div>
        </div>
      )}

      {selectionMode && selectedCount > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-info">
            <span className="selected-count">
              {selectedCount} utente{selectedCount !== 1 ? 'i' : ''} selezionato{selectedCount !== 1 ? 'i' : ''}
            </span>
          </div>
          <div className="bulk-buttons">
            <button
              className="bulk-btn export"
              onClick={onExportExcel}
              title="Esporta in Excel"
            >
              📊 Excel
            </button>
            <button
              className="bulk-btn export"
              onClick={onExportCSV}
              title="Esporta in CSV"
            >
              📄 CSV
            </button>
            <button
              className="bulk-btn danger"
              onClick={onDeleteSelected}
              title="Elimina selezionati"
            >
              🗑️ Elimina
            </button>
            <button
              className="bulk-btn secondary"
              onClick={onClearSelection}
              title="Deseleziona tutto"
            >
              ✕ Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
