import { create } from 'zustand'
import { axiosInstance  } from '../lib/axios.tsx'
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';


interface AuthUser {
  id: Number
  name:string
  email: string
  password: string
  createdAt: Number
  profilePic: string
}

interface AuthState {
  authUser: AuthUser | any; // Replace 'any' with a specific type if available
  isSigningUp: boolean;
  isLoggingIn: boolean; // State for logging button
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
}

interface SignupData {
  name: string;
  email: string;
  password: string;
 }
 

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
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in checkAuth:', error.message);
      } else {
        // Handle non-Axios errors
        console.error('Unexpected error in checkAuth:', error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true})

    try {
      const res = await axiosInstance.post("/auth/signup", data)
      set({ authUser: res.data})
      toast.success("Account created successfullt")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // The error is an AxiosError
        if (error.response) {
          //Accessing the response data safely
          toast.error(error.response.data.message)
        } else{
          // Handle cases where there is no response (e.g., network errors)
          toast.error('No response received from the server')
        }
      } else {
        // Handle non-Axios errors
        toast.error('An unexpected error occured.')
      }
    } finally {
      set({ isSigningUp: false})
    }
  },
  logout: async() => {
    try {
      await axiosInstance.post("/auth/logout")
      set({ authUser: null})
      toast.success("Logged out successfully")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // The error is an AxiosError
        if (error.response) {
          //Accessing the response data safely
          toast.error(error.response.data.message)
        } else{
          // Handle cases where there is no response (e.g., network errors)
          toast.error('No response received from the server')
        }
      } else {
        // Handle non-Axios errors
        toast.error('An unexpected error occured.')
      }
    }
  }
}));
