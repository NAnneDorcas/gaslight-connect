import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const TEAM_SLUG = import.meta.env.VITE_TEAM_SLUG;

export const supabase = createClient(supabaseUrl, supabaseKey);