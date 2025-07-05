export type LoginFormData = {
  username: string;
  password: string;
}

export type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  nic: string;
  role: string;
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
  options?: { label: string; value: string }[]; 
}

export type AuthContextType = {
  isAuthenticated: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    [key: string]: any; // nic, phone, _id, etc.
  } | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}
