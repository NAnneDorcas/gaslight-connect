import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Offer } from "@/components/Offer";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";

import { useEffect, useState } from "react";
import { supabase, TEAM_SLUG } from "@/lib/supabase";

const Index = () => {
  const [language, setLanguage] = useState("en");
  const [blocks, setBlocks] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [formFields, setFormFields] = useState<any[]>([]);
  const [pageSeo, setPageSeo] = useState<any>(null);
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>(["en"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCmsContent() {
      setLoading(true);

      // site config
      const { data: config } = await supabase
        .from("site_config")
        .select("*")
        .eq("team_slug", TEAM_SLUG)
        .single();

      if (config?.enabled_languages) {
        setEnabledLanguages(config.enabled_languages);
      }

      // SEO
      const { data: page } = await supabase
        .from("pages")
        .select("*")
        .eq("team_slug", TEAM_SLUG)
        .eq("language", language)
        .single();

      setPageSeo(page);

      // blocks
      const { data: blocksData, error: blocksError } = await supabase
      .from("blocks")
      .select("*")
      .eq("team_slug", TEAM_SLUG)
      .eq("language", language)
      .eq("hidden", false)
      .order("sort_order", { ascending: true });

// DEBUG LOGS
      console.log("TEAM_SLUG:", TEAM_SLUG);
      console.log("LANGUAGE:", language);
      console.log("blocksData:", blocksData);
      console.log("blocksError:", blocksError);
      setBlocks(blocksData || []);

      // menu
      const { data: menuData } = await supabase
        .from("menu_items")
        .select("*")
        .eq("team_slug", TEAM_SLUG)
        .eq("language", language)
        .eq("enabled", true)
        .order("sort_order", { ascending: true });

      setMenuItems(menuData || []);

      // form
      const { data: fieldsData } = await supabase
        .from("form_fields")
        .select("*")
        .eq("team_slug", TEAM_SLUG)
        .eq("language", language)
        .order("sort_order", { ascending: true });

      setFormFields(fieldsData || []);

      setLoading(false);
    }

    loadCmsContent();
  }, [language]);

  if (loading) {
    return <div className="p-8">Loading website content...</div>;
  }

  const heroBlock = blocks.find(b => b.type === "hero");
  const aboutBlock = blocks.find(b => b.type === "about");
  const offerBlock = blocks.find(b => b.type === "offers");
  const contactBlock = blocks.find(b => b.type === "contact");
  const footerBlock = blocks.find(b => b.type === "footer");

  return (
    <>
      <SeoHead seo={pageSeo} />

      <SiteHeader
        menuItems={menuItems}
        enabledLanguages={enabledLanguages}
        language={language}
        setLanguage={setLanguage}
      />

      <Hero block={heroBlock} />

      <About block={aboutBlock} />

      <Offer block={offerBlock} />

      <Contact
        block={contactBlock}
        formFields={formFields}
      />

      <Footer block={footerBlock} />
    </>
  );
};

export default Index;