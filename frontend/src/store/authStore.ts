import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/task';
import { api } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await api.login(email, password);
          localStorage.setItem('taskflow-token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          return false;
        }
      },
      
      logout: () => {
        localStorage.removeItem('taskflow-token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await api.register(name, email, password);
          localStorage.setItem('taskflow-token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          return false;
        }
      },
    }),
    {
      name: 'taskflow-auth',
    }
  )
);
