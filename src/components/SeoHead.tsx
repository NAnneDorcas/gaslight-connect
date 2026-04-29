import { useEffect } from "react";

export const SeoHead = ({ seo }: { seo?: any }) => {
  useEffect(() => {
    if (seo?.title) {
      document.title = seo.title;
    }

    const ensureMeta = (name: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }

      return meta;
    };

    ensureMeta("description").setAttribute(
      "content",
      seo?.meta_description ||
        "High-quality refrigerant gas trading for HVAC, refrigeration, and industrial applications."
    );

    ensureMeta("mainor-assignment").setAttribute("content", "ai-web-2026");
    ensureMeta("team-slug").setAttribute("content", "TEAM_SLUG");
  }, [seo]);

  return null;
};