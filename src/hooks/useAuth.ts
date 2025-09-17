import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/firebase';
import type { User } from '../types';

export const useAuth = () => {
  const { state, dispatch } = useAppContext();
  const { user, loading } = state;
  const [authLoading, setAuthLoading] = useState(true);

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((userData: User | null) => {
      dispatch({ type: 'SET_USER', payload: userData });
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Sign in with Google
  const signInWithGoogle = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const userData = await authService.signInWithGoogle();
      dispatch({ type: 'SET_USER', payload: userData });
      
      // Show success message
      console.log('Successfully signed in:', userData.displayName || userData.email);
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to sign in' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      await authService.signOut();
      dispatch({ type: 'SET_USER', payload: null });
      
      console.log('Successfully signed out');
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to sign out' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Check if user is admin
  const isAdmin = (): boolean => {
    return user?.isAdmin || false;
  };

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    return !!user;
  };

  return {
    user,
    loading: loading || authLoading,
    signInWithGoogle,
    signOut,
    isAdmin,
    isAuthenticated,
    error: state.error
  };
};
