import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import CmsLayout from "./pages/cms/CmsLayout.tsx";
import Overview from "./pages/cms/Overview.tsx";
import Blocks from "./pages/cms/Blocks.tsx";
import MenuPage from "./pages/cms/MenuPage.tsx";
import FormsPage from "./pages/cms/FormsPage.tsx";
import SeoPage from "./pages/cms/SeoPage.tsx";
import LanguagesPage from "./pages/cms/LanguagesPage.tsx";
import UsersPage from "./pages/cms/UsersPage.tsx";
import { LangContext, type Lang } from "./lib/i18n";

const queryClient = new QueryClient();

const App = () => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "en");
  useEffect(() => { localStorage.setItem("lang", lang); }, [lang]);

  return (
    <QueryClientProvider client={queryClient}>
      <LangContext.Provider value={{ lang, setLang }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cms" element={<CmsLayout />}>
                <Route index element={<Overview />} />
                <Route path="blocks" element={<Blocks />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="forms" element={<FormsPage />} />
                <Route path="seo" element={<SeoPage />} />
                <Route path="languages" element={<LanguagesPage />} />
                <Route path="users" element={<UsersPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LangContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
