import { createClient } from "@supabase/supabase-js";
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from "astro:env/client";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing Supabase environment variables");
// }

export const supabase = createClient(
  "https://srhqktxktputkrfezuvl.supabase.co",
  "supabaseAnonKey",
);
