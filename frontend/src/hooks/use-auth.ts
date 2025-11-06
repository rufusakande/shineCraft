import { useState, useEffect } from 'react';
import { authService, User } from '@/lib/api';
import { socketService } from '@/lib/socket';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    if (currentUser) {
      socketService.connect();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      socketService.connect();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await authService.register({ email, password, username });
      setUser(response.user);
      socketService.connect();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    socketService.disconnect();
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth;