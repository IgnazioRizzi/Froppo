import axios, { AxiosError } from 'axios';

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

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  expiresAt: string;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private loginAttempts: number = 0;
  private lastLoginAttempt: number = 0;
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minuti

  constructor() {
    this.token = this.getStoredToken();
    this.refreshToken = this.getStoredRefreshToken();
    this.tokenExpiry = this.getStoredTokenExpiry();
    this.setupAxiosInterceptors();
    this.startTokenRefreshTimer();
  }

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  private getStoredRefreshToken(): string | null {
    try {
      return localStorage.getItem('refreshToken');
    } catch {
      return null;
    }
  }

  private getStoredTokenExpiry(): number | null {
    try {
      const expiry = localStorage.getItem('tokenExpiry');
      return expiry ? parseInt(expiry, 10) : null;
    } catch {
      return null;
    }
  }

  private setStoredToken(token: string, expiry: number): void {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expiry.toString());
    } catch (error) {
      console.error('Errore nel salvataggio del token:', error);
    }
  }

  private clearStoredTokens(): void {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
    } catch (error) {
      console.error('Errore nella rimozione dei token:', error);
    }
  }

  private setupAxiosInterceptors() {
    // Request interceptor per aggiungere il token
    axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token && this.isTokenValid()) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor per gestire errori di autenticazione
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Tentativo di refresh del token
          if (this.refreshToken && !this.isTokenRefreshInProgress) {
            try {
              await this.refreshAccessToken();
              // Riprova la richiesta originale
              if (error.config) {
                return axiosInstance.request(error.config);
              }
            } catch (refreshError) {
              this.logout();
              window.location.href = '/';
            }
          } else {
            this.logout();
            window.location.href = '/';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private isTokenRefreshInProgress = false;

  private isTokenValid(): boolean {
    if (!this.token || !this.tokenExpiry) return false;
    return Date.now() < this.tokenExpiry;
  }

  private startTokenRefreshTimer(): void {
    if (!this.tokenExpiry) return;
    
    const timeUntilExpiry = this.tokenExpiry - Date.now();
    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        this.refreshAccessToken().catch(() => {
          this.logout();
        });
      }, timeUntilExpiry - 60000); // Refresh 1 minuto prima della scadenza
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (this.isTokenRefreshInProgress) return;
    
    this.isTokenRefreshInProgress = true;
    try {
      // In un'applicazione reale, implementare il refresh token
      // Per ora, semplicemente logout se il token è scaduto
      if (!this.isTokenValid()) {
        throw new Error('Token scaduto');
      }
    } finally {
      this.isTokenRefreshInProgress = false;
    }
  }

  private validateCredentials(credentials: LoginRequest): void {
    if (!credentials.username || !credentials.password) {
      throw new Error('Username e password sono obbligatori');
    }

    if (credentials.username.length < 3 || credentials.username.length > 50) {
      throw new Error('Username deve essere tra 3 e 50 caratteri');
    }

    if (credentials.password.length < 6 || credentials.password.length > 100) {
      throw new Error('Password deve essere tra 6 e 100 caratteri');
    }

    // Sanitizzazione input
    credentials.username = credentials.username.trim().toLowerCase();
  }

  private isAccountLocked(): boolean {
    const now = Date.now();
    if (this.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      if (now - this.lastLoginAttempt < this.LOCKOUT_DURATION) {
        return true;
      } else {
        // Reset dopo il periodo di lockout
        this.loginAttempts = 0;
        this.lastLoginAttempt = 0;
      }
    }
    return false;
  }

  private recordLoginAttempt(success: boolean): void {
    if (success) {
      this.loginAttempts = 0;
      this.lastLoginAttempt = 0;
    } else {
      this.loginAttempts++;
      this.lastLoginAttempt = Date.now();
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Validazione input
      this.validateCredentials(credentials);

      // Controllo lockout
      if (this.isAccountLocked()) {
        const remainingTime = Math.ceil((this.LOCKOUT_DURATION - (Date.now() - this.lastLoginAttempt)) / 60000);
        throw new Error(`Account bloccato. Riprova tra ${remainingTime} minuti`);
      }

      console.log('Tentativo di login con:', { username: credentials.username });
      const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
      
      if (response.data && response.data.token) {
        this.token = response.data.token;
        this.tokenExpiry = new Date(response.data.expiresAt).getTime();
        this.setStoredToken(this.token, this.tokenExpiry);
        this.recordLoginAttempt(true);
        
        console.log('Login riuscito per:', response.data.username);
        return response.data;
      } else {
        throw new Error('Risposta del server non valida');
      }
    } catch (error: any) {
      this.recordLoginAttempt(false);
      
      if (error.response?.status === 429) {
        throw new Error('Troppi tentativi di login. Riprova più tardi');
      } else if (error.response?.status === 401) {
        throw new Error('Credenziali non valide');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Dati non validi');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout della connessione. Riprova');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Errore di connessione. Verifica la tua connessione internet');
      }
    }
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    try {
      // Validazione input
      if (!userData.username || !userData.email || !userData.password || !userData.role) {
        throw new Error('Tutti i campi sono obbligatori');
      }

      if (userData.username.length < 3 || userData.username.length > 50) {
        throw new Error('Username deve essere tra 3 e 50 caratteri');
      }

      if (userData.password.length < 8 || userData.password.length > 100) {
        throw new Error('Password deve essere tra 8 e 100 caratteri');
      }

      if (!this.isValidEmail(userData.email)) {
        throw new Error('Email non valida');
      }

      if (!['Admin', 'User'].includes(userData.role)) {
        throw new Error('Ruolo non valido');
      }

      // Sanitizzazione
      userData.username = userData.username.trim().toLowerCase();
      userData.email = userData.email.trim().toLowerCase();

      const response = await axiosInstance.post<LoginResponse>('/auth/register', userData);
      
      if (response.data && response.data.token) {
        this.token = response.data.token;
        this.tokenExpiry = new Date(response.data.expiresAt).getTime();
        this.setStoredToken(this.token, this.tokenExpiry);
        return response.data;
      } else {
        throw new Error('Risposta del server non valida');
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Dati non validi');
      } else if (error.response?.status === 409) {
        throw new Error('Username o email già esistenti');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Errore durante la registrazione');
      }
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async getCurrentUser(): Promise<UserInfo> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Non autenticato');
      }

      const response = await axiosInstance.get<UserInfo>('/auth/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error('Sessione scaduta. Effettua nuovamente il login');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Errore nel recupero delle informazioni utente');
      }
    }
  }

  async getAllAccounts(): Promise<UserInfo[]> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Non autenticato');
      }

      const response = await axiosInstance.get<UserInfo[]>('/admin/accounts');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error('Sessione scaduta. Effettua nuovamente il login');
      } else if (error.response?.status === 403) {
        throw new Error('Accesso negato. Solo gli amministratori possono accedere a questa funzione');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Errore nel recupero degli account');
      }
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        // Chiama l'endpoint di logout
        await axiosInstance.post('/auth/logout');
      }
    } catch (error) {
      // Anche se il logout fallisce, rimuoviamo comunque i dati locali
      console.warn('Errore durante il logout:', error);
    } finally {
      // Rimuovi sempre i dati locali
      this.token = null;
      this.refreshToken = null;
      this.tokenExpiry = null;
      this.clearStoredTokens();
    }
  }

  isAuthenticated(): boolean {
    return !!this.token && this.isTokenValid();
  }

  getToken(): string | null {
    return this.token;
  }

  getRemainingLoginAttempts(): number {
    return Math.max(0, this.MAX_LOGIN_ATTEMPTS - this.loginAttempts);
  }

  getLockoutTimeRemaining(): number {
    if (this.loginAttempts < this.MAX_LOGIN_ATTEMPTS) return 0;
    return Math.max(0, this.LOCKOUT_DURATION - (Date.now() - this.lastLoginAttempt));
  }
}

export const authService = new AuthService();
