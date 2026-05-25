// ===========================================
// SITE CONFIGURATION
// Reads from src/content/settings/site.json
// Edit settings via Pages CMS
// ===========================================

import siteData from '../content/settings/site.json';

export const siteConfig = {
  // Business Information
  business: {
    name: siteData.business?.name || "Dealer Template",
    fullName: siteData.business?.fullName || "John Doe",
    tagline: siteData.business?.tagline || "Premium Marketing Solutions",
    description: siteData.business?.description || "Local Advertising and Digital Marketing Pros",
  },

  // Location
  location: {
    city: siteData.location?.city || "Denver",
    state: siteData.location?.state || "Colorado",
    address: siteData.location?.address || "123 Main Street",
    fullAddress: siteData.location?.fullAddress || "123 Main St, Denver, CO 80202",
  },

  // Contact
  contact: {
    email: siteData.contact?.email || "hello@acmeinc.com",
    phone: siteData.contact?.phone || "3035551234",
    phoneFormatted: siteData.contact?.phoneFormatted || "(303) 555-1234",
  },

  // Brand Colors (used in CSS variables)
  colors: {
    primary: siteData.colors?.primary || "#110133",
    secondary: siteData.colors?.secondary || "#00918E",
    tertiary: siteData.colors?.tertiary || "#4DD599",
    quaternary: siteData.colors?.quaternary || "#FFDC34",
  },

  // Logo
  logo: {
    src: siteData.logo?.src || "https://ntv-template-1.vercel.app/logo/dealer-logo.avif",
    alt: siteData.logo?.alt || "Acme Inc. Logo",
  },

  // Social Media (optional)
  social: {
    facebook: siteData.social?.facebook || "",
    instagram: siteData.social?.instagram || "",
    linkedin: siteData.social?.linkedin || "",
    twitter: siteData.social?.twitter || "",
    youtube: siteData.social?.youtube || "",
  },

  // SEO
  seo: {
    siteName: siteData.seo?.siteName || "Acme Inc.",
    defaultTitle: siteData.seo?.defaultTitle || "Acme Inc. | Digital Marketing in Denver",
    defaultDescription: siteData.seo?.defaultDescription || "Denver's trusted digital marketing agency. Indoor billboard ads, web design, PPC, social media & Connected TV. Free consultation!",
    keywords: siteData.seo?.keywords || "digital marketing Denver, local advertising Denver",
    siteUrl: siteData.seo?.siteUrl || "https://marquee-hub-template.vercel.app",
    ogImage: siteData.seo?.ogImage || "https://ntv-template-1.vercel.app/logo/dealer-logo.avif",
    twitterHandle: siteData.seo?.twitterHandle || "@acmeinc",
  },

  // Analytics
  analytics: {
    googleAnalyticsId: siteData.analytics?.googleAnalyticsId || "",
  },

  // Template Info (not editable via CMS)
  template: {
    id: "8",
    name: "Progressive Section Layout",
  },
}

// Helper to get location-aware text
export function getLocationText(text: string) {
  return text
    .replaceAll("{city}", siteConfig.location.city)
    .replaceAll("{state}", siteConfig.location.state)
    .replaceAll("{business}", siteConfig.business.name)
}
