import { defineStore } from 'pinia';
import api from '../api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    error: 'esta aqui',
  }),
  actions: {
    async login(credentials) {
      try {
        const { data } = await api.post('auth', { form: credentials });

        if (data.status == false) {
          throw new Error(data.message);
        }
        this.user = data.auth;
        this.isAuthenticated = true;
        return data;

      } catch (error) {
        throw error.response.data.message;
      }
    },
    setAuthUser(data) {
      this.user = data;
      this.isAuthenticated = true;
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    }
  }
});