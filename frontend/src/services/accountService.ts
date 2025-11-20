import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' 
  ? 'https://froppo-production.up.railway.app'
  : 'http://localhost:5248');
const API_URL = `${API_BASE_URL}/api`;

// Configurazione axios per sicurezza
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 secondi timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor per aggiungere il token di autenticazione a tutte le richieste
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestire gli errori di autenticazione
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string | null;
  isActive: boolean;
}

export interface CreateAccountRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export const accountService = {
  getAllAccounts: async (): Promise<UserAccount[]> => {
    try {
      const response = await axiosInstance.get<UserAccount[]>('/admin/accounts');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Sessione scaduta. Effettua nuovamente il login');
      } else if (error.response?.status === 403) {
        throw new Error('Accesso negato. Solo gli amministratori possono accedere a questa funzione');
      }
      throw new Error(error.response?.data?.message || 'Errore nel caricamento degli account');
    }
  },

  createAccount: async (accountData: CreateAccountRequest): Promise<UserAccount> => {
    try {
      const response = await axiosInstance.post<UserAccount>('/admin/accounts', accountData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Sessione scaduta. Effettua nuovamente il login');
      } else if (error.response?.status === 403) {
        throw new Error('Accesso negato. Solo gli amministratori possono creare account');
      }
      const errorMessage = error.response?.data?.message || error.response?.data || 'Errore nella creazione dell\'account';
      throw new Error(errorMessage);
    }
  },

  toggleAccountStatus: async (accountId: string): Promise<UserAccount> => {
    try {
      const response = await axiosInstance.put<UserAccount>(`/admin/accounts/${accountId}/toggle-status`, {});
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Sessione scaduta. Effettua nuovamente il login');
      } else if (error.response?.status === 403) {
        throw new Error('Accesso negato. Solo gli amministratori possono modificare gli account');
      }
      throw new Error(error.response?.data?.message || 'Errore nella modifica dello stato dell\'account');
    }
  },

  deleteAccount: async (accountId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/admin/accounts/${accountId}`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Sessione scaduta. Effettua nuovamente il login');
      } else if (error.response?.status === 403) {
        throw new Error('Accesso negato. Solo gli amministratori possono eliminare account');
      }
      throw new Error(error.response?.data?.message || 'Errore nell\'eliminazione dell\'account');
    }
  }
};
