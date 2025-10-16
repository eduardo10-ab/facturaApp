export interface User {
  user: string;
  companyName?: string;
  token: string;
  rol: {
    nombre: string;
    codigo: string;
    descripcion?: string;
    activo?: boolean;
  };
  roles: string[];
  tokenType: string;
}

export interface AuthResponse {
  status: string;
  body: User;
  error?: string;
  message?: string;
}

export interface LoginCredentials {
  user: string;
  pwd: string;
}
