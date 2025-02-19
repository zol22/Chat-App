export interface AuthUser {
  id: number;
  name: string;
  email: string;
  password: string
  profilePic?: string;
  createdAt: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
 }

 export  interface LoginData {
  email: string;
  password: string
 }

 export interface UpdateProfileData {
  profilePic?: string;
}

export interface AuthState {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}