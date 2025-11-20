import React from 'react';
import { Button } from 'primereact/button';
import { useTheme } from '../../hooks/useTheme';

export const ThemeSelector: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-selector">
      <Button
        icon={theme === 'classic' ? 'pi pi-moon' : 'pi pi-sun'}
        onClick={toggleTheme}
        className="theme-toggle-button"
        tooltip={theme === 'classic' ? 'Passa al tema chiaro' : 'Passa al tema classico'}
        tooltipOptions={{ position: 'bottom' }}
        rounded
        text
        severity="secondary"
      />
    </div>
  );
};


