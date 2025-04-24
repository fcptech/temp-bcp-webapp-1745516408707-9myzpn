import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './contexts/QueryProvider';
import { LoadingScreen } from './components/LoadingScreen';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Debug from './pages/Debug';
import './i18n';

// Lazy load routes
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AccountDetail = React.lazy(() => import('./pages/AccountDetail'));
const WidgetDemo = React.lazy(() => import('./pages/WidgetDemo'));
const Insurance = React.lazy(() => import('./pages/Insurance'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const Legal = React.lazy(() => import('./pages/Legal'));
const ApiDocumentation = React.lazy(() => import('./pages/ApiDocumentation'));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppContent() {
  const [searchParams] = useSearchParams();
  const embedded = searchParams.get('embedded') === 'true';
  const theme = searchParams.get('theme') || 'light';
  const language = searchParams.get('language') || 'es';
  const view = searchParams.get('view') || 'dashboard';
  const mode = searchParams.get('mode') || 'embedded';
  const sections = searchParams.get('sections')?.split(',') || [];
  const accountId = searchParams.get('accountId');

  // Listen for configuration updates from parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'config-update') {
        const { view, accountId, enabledSections } = event.data.config;
        const url = new URL(window.location.href);
        
        if (view) url.searchParams.set('view', view);
        if (accountId) url.searchParams.set('accountId', accountId);
        if (enabledSections) url.searchParams.set('sections', enabledSections.join(','));
        
        window.history.replaceState({}, '', url.toString());
        window.location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (embedded) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        {view === 'dashboard' ? (
          <Dashboard embedded enabledSections={sections} />
        ) : (
          <AccountDetail embedded accountId={accountId} enabledSections={sections} />
        )}
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/account/:id"
          element={
            <PrivateRoute>
              <AccountDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/widget-demo"
          element={
            <PrivateRoute>
              <WidgetDemo />
            </PrivateRoute>
          }
        />
        <Route
          path="/insurance"
          element={
            <PrivateRoute>
              <Insurance />
            </PrivateRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <PrivateRoute>
              <FAQ />
            </PrivateRoute>
          }
        />
        <Route
          path="/legal"
          element={
            <PrivateRoute>
              <Legal />
            </PrivateRoute>
          }
        />
        <Route
          path="/api-docs"
          element={
            <PrivateRoute>
              <ApiDocumentation />
            </PrivateRoute>
          }
        />
        <Route
          path="/debug"
          element={
            <PrivateRoute>
              <Debug />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}