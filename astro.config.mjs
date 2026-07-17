// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import sanity from '@sanity/astro';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  ''
);

// https://astro.build/config
export default defineConfig({
  site: 'https://marquee-hub-template.vercel.app',
  output: 'static',
  trailingSlash: 'never',
  adapter: vercel(),
  
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      cssMinify: 'lightningcss',
      minify: 'esbuild',
      target: 'esnext',
      cssCodeSplit: true,
    },
  },

  integrations: [
    react(), // Used for server-side rendering of lucide-react icons, and to embed Sanity Studio
    alpinejs(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || 'production',
      // Fetch fresh (non-cached) content at build time since this is a static build.
      useCdn: false,
      studioBasePath: '/admin',
    }),
  ],

  compressHTML: true,
  
  build: {
    inlineStylesheets: 'always',
    assets: '_astro',
  },

  experimental: {
    clientPrerender: true,
    contentIntellisense: true,
  },

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  }
});
