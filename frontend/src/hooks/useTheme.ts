import { useState, useEffect } from 'react';

export type Theme = 'classic' | 'white';

const THEME_STORAGE_KEY = 'app-theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Carica il tema salvato o usa 'classic' come default
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme as Theme) || 'classic';
  });

  useEffect(() => {
    // Salva il tema nel localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Applica il tema al body
    document.body.setAttribute('data-theme', theme);
    
    // Aggiungi o rimuovi la classe per il tema bianco
    if (theme === 'white') {
      document.body.classList.add('theme-white');
    } else {
      document.body.classList.remove('theme-white');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'classic' ? 'white' : 'classic');
  };

  return { theme, setTheme, toggleTheme };
};


