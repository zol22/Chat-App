import { create } from 'zustand'
import { axiosInstance  } from '../lib/axios.tsx'
import toast from 'react-hot-toast';


interface AuthUser {
  id: Number
  name:string
  email: string
  password: string
  createdAt: Number
  profilePic: string
}

interface SignupData {
  name: string;
  email: string;
  password: string;
 }

 interface LoginData {
  email: string;
  password: string
 }

interface AuthState {
  authUser: AuthUser | any; // Replace 'any' with a specific type if available
  isSigningUp: boolean;
  isLoggingIn: boolean; // State for logging button
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>
  login: (data: LoginData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
}


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
