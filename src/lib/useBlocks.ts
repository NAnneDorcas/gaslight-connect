import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

type Block = {
  key: string; title: string | null; subtitle: string | null;
  body: string | null; image_url: string | null; order: number;
};

export const useBlocks = () => {
  const { lang } = useLang();
  const [blocks, setBlocks] = useState<Record<string, Block>>({});

  useEffect(() => {
    supabase.from("content_blocks").select("*").eq("language", lang)
      .order("order").then(({ data }) => {
        const map: Record<string, Block> = {};
        (data ?? []).forEach((b: any) => { map[b.key] = b; });
        setBlocks(map);
      });
  }, [lang]);

  return blocks;
};
