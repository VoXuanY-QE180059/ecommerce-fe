import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://ecommerce-be-p4qj.onrender.com/auth';

interface JWTPayload {
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
}

export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const decodeJWT = (token: string): JWTPayload => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token format');
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      
      if (response.data?.data?.token) {
        const token = response.data.data.token;
        setToken(token);
        const payload = decodeJWT(token);
        
        return {
          token: token,
          user: {
            email: payload.email,
            role: payload.role
          }
        };
      }
      throw new Error('Invalid response format');
    } catch (error: any) {
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };
  
  export const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      
      if (response.data?.data) {
        // Sau khi register thành công, tự động login
        return login(data);
      }
      throw new Error('Invalid response format');
    } catch (error: any) {
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

export const logout = (): void => {
  removeToken();
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }
  
  try {
    const payload = decodeJWT(token);
    const now = Date.now();
    const expiry = payload.exp * 1000;
    const isExpired = expiry <= now;
    
    if (isExpired) {
      removeToken();
      return false;
    }
    
    return true;
  } catch (error) {
    removeToken();
    return false;
  }
};

export const getCurrentUser = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  
  try {
    const payload = decodeJWT(token);
    const user = {
      email: payload.email,
      role: payload.role
    };
    return user;
  } catch (error) {
    return null;
  }
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};