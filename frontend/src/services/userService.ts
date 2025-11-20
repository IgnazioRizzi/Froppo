import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' 
  ? 'https://froppo-production.up.railway.app'
  : 'http://localhost:5248');
const API_URL = `${API_BASE_URL}/api`;

// Configurazione axios con autenticazione
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere il token JWT alle richieste
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  dateOfBirth: string;
  placeOfBirth: string;
  residence: string;
  certificate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  userId?: string; // Opzionale, verrà impostato dal backend
  dateOfBirth: string;
  placeOfBirth: string;
  residence: string;
  certificate?: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: number;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async updateUser(id: string, userData: Partial<CreateUserRequest>): Promise<User> {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};
