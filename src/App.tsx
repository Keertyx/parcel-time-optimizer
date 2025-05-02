
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Index from "./pages/Index";
import SenderModule from "./pages/SenderModule";
import ReceiverModule from "./pages/ReceiverModule";
import PostOfficeModule from "./pages/PostOfficeModule";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { ParcelProvider } from "./context/ParcelContext";
import { AuthProvider, useAuth, UserRole } from "./context/AuthContext";

const queryClient = new QueryClient();

// Protected route component that checks for authentication and role
const ProtectedRoute = ({ 
  allowedRoles,
}: { 
  allowedRoles: UserRole[];
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

// AppRoutes component that uses AuthContext
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Redirect logged in users based on their role
  const handleHomeRedirect = () => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    
    switch (user?.role) {
      case 'sender':
        return <Navigate to="/sender" replace />;
      case 'receiver':
        return <Navigate to="/receiver" replace />;
      case 'post-office':
        return <Navigate to="/post-office" replace />;
      default:
        return <Index />;
    }
  };
  
  return (
    <>
      {isAuthenticated && <Header />}
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />} />
          <Route path="/" element={handleHomeRedirect()} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute allowedRoles={['sender']} />}>
            <Route path="/sender" element={<SenderModule />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['receiver']} />}>
            <Route path="/receiver" element={<ReceiverModule />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['post-office']} />}>
            <Route path="/post-office" element={<PostOfficeModule />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ParcelProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ParcelProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
