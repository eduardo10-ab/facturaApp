import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

// Pages
import Login from '@/pages/login';
import Dashboard from '@/pages/Dashboard';
import DocumentSelection from '@/pages/documentSelection';
import CreditoFiscalForm from '@/pages/forms/creditoFiscal';
import FacturaForm from '@/pages/forms/factura';
import NotaCreditoForm from '@/pages/forms/notaCredito';
import FacturaExcluidoForm from '@/pages/forms/facturaExcluido';
import FacturaExportacionForm from '@/pages/forms/facturaExportacion';
import NotaDebitoForm from '@/pages/forms/notaDebito';
import NotaRemisionForm from '@/pages/forms/notaRemision';
import ComprobanteRetencionForm from '@/pages/forms/comprobanteRetencion';
import DeclaracionRentaForm from '@/pages/forms/declaracionRenta';

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
                <FacturaForm  />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/declaracionRenta" 
            element={
              <ProtectedRoute>
                <DeclaracionRentaForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/notaCredito" 
            element={
              <ProtectedRoute>
                <NotaCreditoForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/notaDebito" 
            element={
              <ProtectedRoute>
                <NotaDebitoForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/comprobanteRetencion" 
            element={
              <ProtectedRoute>
                <ComprobanteRetencionForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/facturaExportacion" 
            element={
              <ProtectedRoute>
                <FacturaExportacionForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/facturaExcluido" 
            element={
              <ProtectedRoute>
                <FacturaExcluidoForm />
              </ProtectedRoute>
            } 
          />

                    <Route 
            path="/documents/notaRemision" 
            element={
              <ProtectedRoute>
                <NotaRemisionForm />
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