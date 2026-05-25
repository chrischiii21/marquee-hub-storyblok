// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://marquee-hub-template.vercel.app',
  output: 'static',
  trailingSlash: 'always',
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
    react(), // Used for server-side rendering of lucide-react icons
    alpinejs(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
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
