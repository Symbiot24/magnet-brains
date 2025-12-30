const API_URL = import.meta.env.VITE_API_URL || 'https://magnet-brains.onrender.com/api';

const getToken = () => localStorage.getItem('taskflow-token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  async register(name: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_URL}/auth/me`, { headers: headers() });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  // Tasks
  async getTasks() {
    const res = await fetch(`${API_URL}/tasks`, { headers: headers() });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  async createTask(data: any) {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  async updateTask(id: string, data: any) {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  async deleteTask(id: string) {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  // Users
  async getUsers() {
    const res = await fetch(`${API_URL}/users`, { headers: headers() });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  // Team (Personal team lists)
  async getMyTeam() {
    const res = await fetch(`${API_URL}/team/my-team`, { headers: headers() });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  async addTeamMember(email: string) {
    const res = await fetch(`${API_URL}/team/my-team/add`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  async removeTeamMember(userId: string) {
    const res = await fetch(`${API_URL}/team/my-team/${userId}`, {
      method: 'DELETE',
      headers: headers(),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
};
