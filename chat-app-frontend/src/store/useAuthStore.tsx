import { create } from 'zustand'
import { axiosInstance  } from '../lib/axios.tsx'
import toast from 'react-hot-toast';
import { AuthState } from "../types/authTypes"; //  Import types


// ❌ No need to manually handle errors! Interceptors take care of it.
export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true})
    try {
      const res = await axiosInstance.post("/auth/signup", data) // res container whatever my backend returns in the response body
      set({ authUser: res.data})
      toast.success("Account created successfully")
    } finally {
      set({ isSigningUp: false})
    }
  },
  login: async (data) => {
    set({ isLoggingIn : true})
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data})
      toast.success("Logged in successfully")
    } finally {
      set({ isLoggingIn: false})
    }
  },
  logout: async() => {
    try {
      await axiosInstance.post("/auth/logout")
      set({ authUser: null})
      toast.success("Logged out successfully")
    } catch (error) {
      // ❌ No need to manually handle errors! Interceptors take care of it.
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true}) 
    try {
      const res = await axiosInstance.put("/auth/updateProfile", data)
      set({ authUser: res.data })
      toast.success("Profile updated successfully")
    }  finally {
      set({ isUpdatingProfile: false})
    }
  }
}));
