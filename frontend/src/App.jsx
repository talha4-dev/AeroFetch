import { createHashRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ToastNotification';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErrorPage';

function PageLoader() {
  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '3px solid rgba(108,99,255,0.2)', borderTopColor: '#6c63ff',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'var(--font-body)' }}>Loading AeroFetch...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

function AppProviders({ children }) {
  const { logout } = useAuth();

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('aerofetch:unauthorized', handler);
    return () => window.removeEventListener('aerofetch:unauthorized', handler);
  }, [logout]);

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppProviders>
            <RouterProvider router={router} />
          </AppProviders>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
