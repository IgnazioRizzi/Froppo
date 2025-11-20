export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  dateOfBirth: string; // ISO string format
  placeOfBirth: string;
  residence: string;
  codiceFiscale?: string;
  certificate?: string;
  createdAt: string; // ISO string format
  updatedAt?: string; // ISO string format
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  userId?: string; // Opzionale per admin
  dateOfBirth: string;
  placeOfBirth: string;
  residence: string;
  codiceFiscale?: string;
  certificate?: string;
}

export interface UpdateUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userId?: string; // Opzionale per admin
  dateOfBirth: string;
  placeOfBirth: string;
  residence: string;
  codiceFiscale?: string;
  certificate?: string;
}
