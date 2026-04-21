// @ts-check
import { defineConfig, envField } from "astro/config";
// import { loadEnv } from "vite";
import svelte from "@astrojs/svelte";

import vercel from "@astrojs/vercel";

// const supabaseUrl = loadEnv(process.env.NODE_ENV, process.cwd()).SUPABASE_URL;
// const supabaseAnonKey = loadEnv(process.env.NODE_ENV, process.cwd()).SUPABASE_ANON_KEY;

export default defineConfig({
  output: "server",

  // env: {
  //   schema: {
  //     SUPABASE_URL: envField.string({
  //       context: "server",
  //       access: "public",
  //       default: supabaseUrl,
  //       // default: "https://srhqktxktputkrfezuvl.supabase.co",
  //     }),
  //     SUPABASE_ANON_KEY: envField.string({
  //       context: "server",
  //       access: "public",
  //       default: supabaseAnonKey,
  //       // default: "sb_publishable_nlAY-EhqxX4VK3QA-GrU6w_omqeQxlL",
  //     }),
  //   },
  // },
  // vite: {
  //   ssr: {
  //     noExternal: ["maplibre-gl"],
  //   },
  // },
  integrations: [svelte()],

  adapter: vercel(),
});