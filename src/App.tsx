import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import AlumniDirectory from "./pages/AlumniDirectory";
import AlumniDirectoryLanding from "./pages/AlumniDirectoryLanding";
import Committee from "./pages/Committee";
import Sponsors from "./pages/Sponsors";
import MentorshipCareer from "./pages/MentorshipCareer";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CompleteProfile from "./pages/CompleteProfile";
import EnhancedProfilePage from "./components/profile/EnhancedProfilePage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import HallOfFame from "./pages/HallOfFame";
import NoticeBoard from "./pages/NoticeBoard";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/events" element={<Events />} />
              <Route path="/alumni-directory" element={
                <ProtectedRoute>
                  <AlumniDirectory />
                </ProtectedRoute>
              } />
              <Route path="/alumni-directory-preview" element={<AlumniDirectoryLanding />} />
              <Route path="/committee" element={<Committee />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/hall-of-fame" element={<HallOfFame />} />
              <Route path="/magazine" element={<Blog />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/notice-board" element={<NoticeBoard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/profile/:userId" element={<EnhancedProfilePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
