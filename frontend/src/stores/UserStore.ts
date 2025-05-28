import { create } from 'zustand';
import axios from 'axios';

interface User {
  userid: number;
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,
  fetchUser: async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    set({ user: null, isLoading: false });
    return;
  }

  try {
    const res = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const userData = await axios.get(`http://localhost:5000/api/users/${res.data.userId}`);
    set({ user: userData.data, isLoading: false });
  } catch (err) {
    console.error('fetchUser error:', err);
    set({ user: null, isLoading: false });
  }
},

  logout: () => set({ user: null }),
}));
