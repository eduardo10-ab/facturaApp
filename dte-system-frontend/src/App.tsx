import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

// Pages
import Login from '@/pages/login';
import Dashboard from '@/pages/Dashboard';
import DocumentSelection from '@/pages/documentSelection';
import CreditoFiscalForm from '@/pages/forms/creditoFiscal';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/documents" 
            element={
              <ProtectedRoute>
                <DocumentSelection />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/documents/ccf" 
            element={
              <ProtectedRoute>
                <CreditoFiscalForm />
              </ProtectedRoute>
            } 
          />

          {/* Redirect root to factura */}
          <Route 
            path="/documents/factura" 
            element={
              <ProtectedRoute>
                <CreditoFiscalForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/declaracionRenta" 
            element={
              <ProtectedRoute>
                <CreditoFiscalForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/notaCredito" 
            element={
              <ProtectedRoute>
                <CreditoFiscalForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/notaDebito" 
            element={
              <ProtectedRoute>
                <CreditoFiscalForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/comprobanteRetencion" 
            element={
              <ProtectedRoute>
                <CreditoFiscalForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/facturaExportacion" 
            element={
              <ProtectedRoute>
                <CreditoFiscalForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/facturaExcluido" 
            element={
              <ProtectedRoute>
                <CreditoFiscalForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/notaRemision" 
            element={
              <ProtectedRoute>
                <CreditoFiscalForm />
              </ProtectedRoute>
            } 
          />

          {/* 404 - Redirect to dashboard */}
          <Route 
            path="*" 
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;