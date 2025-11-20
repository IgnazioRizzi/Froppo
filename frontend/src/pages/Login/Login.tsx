import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { ProgressBar } from 'primereact/progressbar';
import { authService, LoginRequest } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common';

interface LoginProps {
  onLogin: (userInfo: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { toasts, addToast, removeToast } = useToast();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    // Controlla se l'utente è già autenticato
    if (authService.isAuthenticated()) {
      authService.getCurrentUser()
        .then(userInfo => onLogin(userInfo))
        .catch(() => {
          // Se il token è scaduto, rimuovilo
          authService.logout();
        });
    }

    // Controlla se c'è un lockout attivo
    const lockoutRemaining = authService.getLockoutTimeRemaining();
    if (lockoutRemaining > 0) {
      setLockoutTime(lockoutRemaining);
      const interval = setInterval(() => {
        const remaining = authService.getLockoutTimeRemaining();
        setLockoutTime(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [onLogin]);

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      addToast({
        type: 'warning',
        message: '⚠️ Inserisci il tuo username',
        duration: 4000
      });
      return false;
    } else if (formData.username.length < 3) {
      addToast({
        type: 'warning',
        message: '⚠️ Username troppo corto (minimo 3 caratteri)',
        duration: 4000
      });
      return false;
    } else if (formData.username.length > 50) {
      addToast({
        type: 'warning',
        message: '⚠️ Username troppo lungo (massimo 50 caratteri)',
        duration: 4000
      });
      return false;
    }

    if (!formData.password) {
      addToast({
        type: 'warning',
        message: '⚠️ Inserisci la tua password',
        duration: 4000
      });
      return false;
    } else if (formData.password.length < 6) {
      addToast({
        type: 'warning',
        message: '⚠️ Password troppo corta (minimo 6 caratteri)',
        duration: 4000
      });
      return false;
    } else if (formData.password.length > 100) {
      addToast({
        type: 'warning',
        message: '⚠️ Password troppo lunga (massimo 100 caratteri)',
        duration: 4000
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Inizio login con formData:', { username: formData.username });
      const loginResponse = await authService.login(formData);
      console.log('Login response:', loginResponse);
      const userInfo = await authService.getCurrentUser();
      console.log('User info:', userInfo);
      
      // Toast di successo
      addToast({
        type: 'success',
        message: '✅ Login effettuato con successo! Accesso in corso...',
        duration: 2000
      });
      
      // Piccolo delay per mostrare il toast di successo
      setTimeout(() => {
        onLogin(userInfo);
      }, 1000);
    } catch (err) {
      console.error('Errore nel login:', err);
      
      // Messaggi di errore più specifici e utili
      let errorMessage = 'Errore durante il login';
      
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          errorMessage = 'Username o password non corretti. Verifica le credenziali.';
        } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
          errorMessage = 'Account bloccato o non autorizzato. Contatta l\'amministratore.';
        } else if (err.message.includes('429') || err.message.includes('Too Many Requests')) {
          errorMessage = 'Troppi tentativi di login. Riprova tra qualche minuto.';
        } else if (err.message.includes('Network') || err.message.includes('fetch')) {
          errorMessage = 'Errore di connessione. Verifica la connessione internet.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Timeout della connessione. Riprova.';
        } else {
          errorMessage = `Errore: ${err.message}`;
        }
      }
      
      // Toast di errore
      addToast({
        type: 'error',
        message: errorMessage,
        duration: 6000
      });
      
      // Controlla se c'è un lockout
      const lockoutRemaining = authService.getLockoutTimeRemaining();
      if (lockoutRemaining > 0) {
        setLockoutTime(lockoutRemaining);
        addToast({
          type: 'warning',
          message: `Account bloccato. Riprova tra ${Math.ceil(lockoutRemaining / 60000)} minuti`,
          duration: 8000
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormDisabled = isLoading || lockoutTime > 0;

  return (
    <div className="glassmorphism-login-container">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="glassmorphism-card">
        {/* Logo e Nome */}
        <div className="profile-icon-container">
          <i className="pi pi-shield profile-icon"></i>
          <h1 className="froppo-title">Froppo</h1>
        </div>

        <form onSubmit={handleSubmit} className="glassmorphism-form">

          {/* Email/Username Field */}
          <div className="glassmorphism-input-group">
            <div className="input-icon">
              <i className="pi pi-envelope"></i>
            </div>
            <InputText
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
              placeholder="Email ID"
              className="glassmorphism-input"
              maxLength={50}
            />
            <div className="input-underline"></div>
          </div>

          {/* Password Field */}
          <div className="glassmorphism-input-group">
            <div className="input-icon">
              <i className="pi pi-lock"></i>
            </div>
            <InputText
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
              placeholder="Password"
              className="glassmorphism-input"
              maxLength={100}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isFormDisabled}
            >
              <i className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`}></i>
            </button>
            <div className="input-underline"></div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="glassmorphism-options">
            <div className="remember-me">
              <Checkbox
                inputId="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.checked || false)}
                disabled={isFormDisabled}
              />
              <label htmlFor="rememberMe" className="remember-me-label">Remember me</label>
            </div>
            <button
              type="button"
              className="forgot-password"
              onClick={() => addToast({
                type: 'info',
                message: 'Funzionalità in sviluppo. Contatta l\'amministratore.',
                duration: 4000
              })}
            >
              Forgot Password?
            </button>
          </div>

          {/* Loading Bar */}
          {isLoading && (
            <div className="glassmorphism-loading">
              <ProgressBar mode="indeterminate" className="glassmorphism-progress" />
            </div>
          )}

          {/* Login Button */}
          <Button 
            type="submit" 
            label="LOGIN"
            className="glassmorphism-button"
            disabled={isFormDisabled}
            loading={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
