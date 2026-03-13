import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import PeoplePage from "@/pages/PeoplePage";
import OrganizationsPage from "@/pages/OrganizationsPage";
import HolidaysPage from "@/pages/HolidaysPage";
import NewsPage from "@/pages/NewsPage";
import EditorPage from "@/pages/EditorPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/holidays" element={<HolidaysPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/editor/:holidayId" element={<EditorPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
