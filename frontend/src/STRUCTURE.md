# Struttura del Frontend

## Organizzazione per Pagine

Il frontend è stato riorganizzato seguendo una struttura basata su pagine per migliorare la manutenibilità e l'organizzazione del codice.

### Cartelle Principali

#### `/pages/`
Contiene le pagine principali dell'applicazione:

- **`Login/`** - Pagina di autenticazione
  - `Login.tsx` - Componente principale di login
  - `index.tsx` - Export del componente

- **`Admin/`** - Pannello amministratore
  - `AdminPanel.tsx` - Pannello principale per admin
  - `AccountManagement.tsx` - Gestione account utenti
  - `index.tsx` - Export dei componenti

- **`User/`** - Vista utente normale
  - `UserView.tsx` - Vista principale per utenti
  - `index.tsx` - Export del componente

- **`People/`** - Gestione dipendenti
  - `UserList.tsx` - Lista dipendenti
  - `UserListView.tsx` - Vista lista dipendenti
  - `index.tsx` - Export dei componenti

#### `/components/`
Contiene i componenti riutilizzabili organizzati per categoria:

- **`common/`** - Componenti comuni
  - `ActionMenu.tsx` - Menu azioni
  - `BulkActions.tsx` - Azioni multiple
  - `ErrorMessage.tsx` - Messaggi di errore
  - `FilterBar.tsx` - Barra filtri
  - `ModernTableView.tsx` - Tabella moderna
  - `NotificationCenter.tsx` - Centro notifiche
  - `RoleMenu.tsx` - Menu ruoli
  - `SearchBar.tsx` - Barra di ricerca
  - `StandardDialog.tsx` - Dialog standard
  - `SuccessMessage.tsx` - Messaggi di successo
  - `ViewTransition.tsx` - Transizioni vista
  - `index.tsx` - Export di tutti i componenti

- **`forms/`** - Componenti per form
  - `UserForm.tsx` - Form utente
  - `UserFormDialog.tsx` - Dialog form utente
  - `index.tsx` - Export dei componenti

- **`layout/`** - Componenti di layout
  - `Header.tsx` - Header dell'applicazione
  - `LogoutButton.tsx` - Pulsante logout
  - `Sidebar.tsx` - Sidebar di navigazione
  - `index.tsx` - Export dei componenti

### Vantaggi della Nuova Struttura

1. **Organizzazione Logica**: I componenti sono raggruppati per funzionalità e scopo
2. **Manutenibilità**: Più facile trovare e modificare i componenti
3. **Scalabilità**: Struttura che supporta la crescita dell'applicazione
4. **Import Puliti**: Import più chiari e organizzati
5. **Separazione delle Responsabilità**: Ogni cartella ha un ruolo specifico

### Import Esempi

```typescript
// Import da pagine
import Login from './pages/Login';
import AdminPanel from './pages/Admin';

// Import da componenti comuni
import { StandardDialog, ActionMenu } from './components/common';

// Import da componenti forms
import { UserForm } from './components/forms';

// Import da componenti layout
import { Header, Sidebar } from './components/layout';
```

### File di Export

Ogni cartella contiene un file `index.tsx` che esporta tutti i componenti della cartella, permettendo import più puliti e organizzati.
