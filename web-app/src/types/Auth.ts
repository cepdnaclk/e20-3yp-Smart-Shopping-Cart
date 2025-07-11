export type LoginFormData = {
  username: string;
  password: string;
}

export type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nic: string;
  role: UserRole;
}

export type ForgotPasswordFormData = {
  username: string;
  email: string;
}

export type ResetPasswordFormData = {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmationPassword: string;
}

export type FormFieldProps = {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
}

export type SelectFieldProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    required?: boolean;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}






// FROM BACEND
export interface Tokens {
  access_token: string;
  refresh_token: string;
  role: UserRole;
}

export interface Profile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  nic?: string;
  storeName?: string;
  role?: UserRole;
  username?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  message?: string;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'STAFF' | 'SECURITY' | 'SUPPLIER';

