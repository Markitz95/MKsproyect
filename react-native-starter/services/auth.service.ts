// services/auth.service.ts
// Servicio de autenticación: login, registro y gestión del token JWT.
// Usa expo-secure-store para guardar el token de forma segura.

import api from './api';
import * as SecureStore from 'expo-secure-store';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  name: string;
  email: string;
  studentCode?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  totalPoints: number;
  completedLocations: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

// ─── Funciones del servicio ──────────────────────────────────────────────────

/**
 * Inicia sesión. Guarda el token JWT en SecureStore.
 * @returns Los datos del usuario autenticado
 */
export const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  const { token, user } = response.data;

  // Guardar el token de forma segura para futuras peticiones
  await SecureStore.setItemAsync('campusquest_token', token);
  // Guardar datos básicos del usuario para acceso offline
  await SecureStore.setItemAsync('campusquest_user', JSON.stringify(user));

  return user;
};

/**
 * Registra un nuevo usuario. Guarda el token automáticamente.
 * @returns Los datos del usuario creado
 */
export const register = async (data: RegisterData): Promise<AuthUser> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  const { token, user } = response.data;

  await SecureStore.setItemAsync('campusquest_token', token);
  await SecureStore.setItemAsync('campusquest_user', JSON.stringify(user));

  return user;
};

/**
 * Cierra la sesión del usuario limpiando el token guardado.
 */
export const logout = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('campusquest_token');
  await SecureStore.deleteItemAsync('campusquest_user');
};

/**
 * Obtiene el usuario guardado localmente (sin llamar al backend).
 * Útil para cargar la sesión al abrir la app.
 */
export const getStoredUser = async (): Promise<AuthUser | null> => {
  try {
    const userStr = await SecureStore.getItemAsync('campusquest_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

/**
 * Verifica si hay una sesión activa (token guardado).
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await SecureStore.getItemAsync('campusquest_token');
  return !!token;
};
