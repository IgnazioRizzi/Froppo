import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import './App.css';
import Login from './pages/Login';
import AdminPanel from './pages/Admin';
import UserView from './pages/User/UserViewComponent';
import { authService, UserInfo } from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userInfo = await authService.getCurrentUser();
        setCurrentUser(userInfo);
        setIsAuthenticated(true);
      }
    } catch (error) {
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userInfo: UserInfo) => {
    setCurrentUser(userInfo);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Errore durante il logout:', error);
      // Anche se c'è un errore, forziamo il logout locale
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <PrimeReactProvider>
        <div className="App">
          <Login onLogin={handleLogin} />
        </div>
      </PrimeReactProvider>
    );
  }

  return (
    <PrimeReactProvider>
      <div className="App">
        {currentUser?.role === 'Admin' ? (
          <AdminPanel currentUser={currentUser!} onLogout={handleLogout} />
        ) : (
          <UserView currentUser={currentUser!} onLogout={handleLogout} />
        )}
      </div>
    </PrimeReactProvider>
  );
}

export default App;
