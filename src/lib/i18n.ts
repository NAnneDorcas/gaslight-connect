import { createContext, useContext } from "react";

export type Lang = "en" | "et";

export const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => {} });

export const useLang = () => useContext(LangContext);

const dict = {
  en: {
    signIn: "Sign in", signOut: "Sign out", cms: "CMS", send: "Send message",
    sent: "Thanks — we'll be in touch.", error: "Something went wrong.",
    blocks: "Blocks", menu: "Menu", forms: "Form fields", seo: "SEO",
    languages: "Languages", users: "Users", overview: "Overview",
    save: "Save", cancel: "Cancel", add: "Add", delete: "Delete", edit: "Edit",
    backToSite: "Back to site",
  },
  et: {
    signIn: "Logi sisse", signOut: "Logi välja", cms: "CMS", send: "Saada sõnum",
    sent: "Aitäh — võtame ühendust.", error: "Midagi läks valesti.",
    blocks: "Plokid", menu: "Menüü", forms: "Vormiväljad", seo: "SEO",
    languages: "Keeled", users: "Kasutajad", overview: "Ülevaade",
    save: "Salvesta", cancel: "Tühista", add: "Lisa", delete: "Kustuta", edit: "Muuda",
    backToSite: "Tagasi lehele",
  },
} as const;

export const t = (lang: Lang, key: keyof typeof dict["en"]) => dict[lang][key];
