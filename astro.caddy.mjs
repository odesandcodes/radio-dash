import { defineConfig } from 'astro/config';
import node from "@astrojs/node"; // The "Dummy" adapter

export default defineConfig({
  output: 'static', // Still static!
  adapter: node({
    mode: "standalone"
  }),
  base: '/radio',
  trailingSlash: 'always',
});