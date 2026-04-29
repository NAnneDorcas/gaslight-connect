import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

export const SeoHead = () => {
  const { lang } = useLang();
  useEffect(() => {
    supabase.from("seo_settings").select("*").eq("page", "home").eq("language", lang).maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        if (data.title) document.title = data.title;
        const ensure = (name: string) => {
          let m = document.querySelector(`meta[name="${name}"]`);
          if (!m) { m = document.createElement("meta"); m.setAttribute("name", name); document.head.appendChild(m); }
          return m;
        };
        if (data.description) ensure("description").setAttribute("content", data.description);
        document.documentElement.lang = lang;
      });
  }, [lang]);
  return null;
};
