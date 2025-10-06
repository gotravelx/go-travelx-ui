export interface User {
    id: string;
    username: string;
    name: string;
  }
  
export interface LoginResponse {
    user: User | null;
    success: boolean;
    username: string;
    token: string | null;
    id?: string;
    name?: string;
    error?: string;
  }