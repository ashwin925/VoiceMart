import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Container from './Container';
import { Shield, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  redirectTo = '/'
}) => {
  const { user, loading, isAdmin, signInWithGoogle } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Container className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking authentication...</p>
      </Container>
    );
  }

  // If user is not authenticated, show sign-in prompt
  if (!user) {
    return (
      <Container className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            You need to sign in to access this page.
          </p>
          <button
            onClick={signInWithGoogle}
            className="btn-primary mb-4"
          >
            Sign In with Google
          </button>
          <div className="text-sm text-gray-500">
            <a href={redirectTo} className="text-blue-600 hover:text-blue-700">
              Go back to home
            </a>
          </div>
        </div>
      </Container>
    );
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin()) {
    return (
      <Container className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need administrator privileges to access this page.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Current user:</strong> {user.displayName || user.email}
            </p>
            <p className="text-sm text-yellow-800 mt-1">
              If you believe you should have admin access, please contact the system administrator.
            </p>
          </div>
          <a href={redirectTo} className="btn-primary">
            Go Home
          </a>
        </div>
      </Container>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;
