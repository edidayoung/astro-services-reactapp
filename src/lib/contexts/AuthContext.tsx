// Admin Authentication Context
// Provides authentication state and functions throughout the app

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import * as authService from '@/lib/admin/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionTimeRemaining: number;
  isExpiringSoon: boolean;
  login: (password: string) => Promise<authService.AuthResult>;
  logout: () => void;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const valid = authService.isSessionValid();
      setIsAuthenticated(valid);
      setIsLoading(false);

      if (valid) {
        const remaining = authService.getSessionTimeRemaining();
        setSessionTimeRemaining(remaining);
        setIsExpiringSoon(authService.isSessionExpiringSoon());
      }
    };

    checkAuth();
  }, []);

  // Update session time remaining every second
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const remaining = authService.getSessionTimeRemaining();
      setSessionTimeRemaining(remaining);
      setIsExpiringSoon(authService.isSessionExpiringSoon());

      // Session expired
      if (remaining === 0) {
        setIsAuthenticated(false);
        toast.error('Session expired. Please log in again.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Show warning when session is expiring soon
  useEffect(() => {
    if (isExpiringSoon && isAuthenticated) {
      const minutesRemaining = Math.ceil(sessionTimeRemaining / 60000);
      
      // Only show toast once when entering warning period
      if (minutesRemaining === 10) {
        toast.warning(
          `Your session will expire in ${minutesRemaining} minutes. Click to extend.`,
          {
            duration: 10000,
            action: {
              label: 'Extend Session',
              onClick: () => {
                extendSession();
                toast.success('Session extended for 3 more hours');
              },
            },
          }
        );
      }
    }
  }, [isExpiringSoon, sessionTimeRemaining, isAuthenticated]);

  // Auto-extend session on user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    let lastActivity = Date.now();

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      const now = Date.now();
      // Only extend if more than 5 minutes since last activity check
      if (now - lastActivity > 5 * 60 * 1000) {
        const extended = authService.extendSession();
        if (extended) {
          const remaining = authService.getSessionTimeRemaining();
          setSessionTimeRemaining(remaining);
          setIsExpiringSoon(false);
          lastActivity = now;
        }
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated]);

  const login = async (password: string): Promise<authService.AuthResult> => {
    const result = await authService.login(password);
    
    if (result.success) {
      setIsAuthenticated(true);
      const remaining = authService.getSessionTimeRemaining();
      setSessionTimeRemaining(remaining);
      toast.success('Welcome back! You are now logged in.');
    }

    return result;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setSessionTimeRemaining(0);
    setIsExpiringSoon(false);
    toast.info('You have been logged out.');
  };

  const extendSession = () => {
    const extended = authService.extendSession();
    if (extended) {
      const remaining = authService.getSessionTimeRemaining();
      setSessionTimeRemaining(remaining);
      setIsExpiringSoon(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        sessionTimeRemaining,
        isExpiringSoon,
        login,
        logout,
        extendSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
