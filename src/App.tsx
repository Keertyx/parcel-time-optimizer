
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import SenderModule from "./pages/SenderModule";
import ReceiverModule from "./pages/ReceiverModule";
import PostOfficeModule from "./pages/PostOfficeModule";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { ParcelProvider } from "./context/ParcelContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ParcelProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <main className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sender" element={<SenderModule />} />
              <Route path="/receiver" element={<ReceiverModule />} />
              <Route path="/post-office" element={<PostOfficeModule />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
      </ParcelProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
