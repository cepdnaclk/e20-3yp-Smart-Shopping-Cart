import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../hooks/services/authService';
import { AuthContextType, Profile } from '../types/Auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  // useEffect(() => {
  //   // Check if user is logged in on mount
  //   const data = authService.getCurrentUser();
  //   const updatedProfile: Profile = {
  //     ...data,
  //     username: "myUsername"
  //   };

  //   if (data && data.token) {
  //     setIsAuthenticated(true);
  //     setProfile(updatedProfile);
  //     // navigate('/editor');
  //   }
  // }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      setIsAuthenticated(true);
      setProfile({...profile, username: username});
      console.log('Login successful:', response);
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setProfile(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, profile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
