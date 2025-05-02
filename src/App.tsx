
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import AlumniDirectory from "./pages/AlumniDirectory";
import Committee from "./pages/Committee";
import Sponsors from "./pages/Sponsors";
import MentorshipCareer from "./pages/MentorshipCareer";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";
import NotFound from "./pages/NotFound";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/alumni-directory" element={<AlumniDirectory />} />
            <Route path="/committee" element={<Committee />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/mentorship-career" element={<MentorshipCareer />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
