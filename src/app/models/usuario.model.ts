export interface Usuario {
  id: number;
  username: string;
  password?: string;  // Opcional para respuestas
  role: 'admin' | 'user' | 'guest';
  estado: boolean;
}

export interface UsuarioResponse {
  id: number;
  username: string;
  role: string;
  estado: boolean;
}