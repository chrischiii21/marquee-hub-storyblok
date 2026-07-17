import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionTypeNames } from './sections'

const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title (SEO)', type: 'string' }),
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'city', title: 'City', type: 'string', description: 'Set on location sub-pages.' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Matches the page URL path, e.g. "about" or "locations/arvada". Use "index" for the homepage.',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Description (SEO)', type: 'text', validation: (Rule) => Rule.required() }),
    defineField({ name: 'keywords', title: 'Keywords (SEO)', type: 'string' }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: sectionTypeNames.map((type) => defineArrayMember({ type })),
    }),
    defineField({ name: 'legalSections', title: 'Legal Sections', type: 'array', of: [defineArrayMember({ type: 'legalSection' })] }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})

const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'business',
      title: 'Business',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string' }),
        defineField({ name: 'fullName', title: 'Full Name', type: 'string' }),
        defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text' }),
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({ name: 'state', title: 'State', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'string' }),
        defineField({ name: 'fullAddress', title: 'Full Address', type: 'string' }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      fields: [
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'phone', title: 'Phone (tel: link)', type: 'string' }),
        defineField({ name: 'phoneFormatted', title: 'Phone (display)', type: 'string' }),
      ],
    }),
    defineField({
      name: 'colors',
      title: 'Brand Colors',
      type: 'object',
      fields: [
        defineField({ name: 'primary', title: 'Primary', type: 'color', options: { disableAlpha: true } }),
        defineField({ name: 'secondary', title: 'Secondary', type: 'color', options: { disableAlpha: true } }),
        defineField({ name: 'tertiary', title: 'Tertiary', type: 'color', options: { disableAlpha: true } }),
        defineField({ name: 'quaternary', title: 'Quaternary', type: 'color', options: { disableAlpha: true } }),
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'object',
      fields: [
        defineField({ name: 'image', title: 'Image', type: 'image' }),
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook', type: 'string' }),
        defineField({ name: 'instagram', title: 'Instagram', type: 'string' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'string' }),
        defineField({ name: 'twitter', title: 'Twitter', type: 'string' }),
        defineField({ name: 'youtube', title: 'YouTube', type: 'string' }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'siteName', title: 'Site Name', type: 'string' }),
        defineField({ name: 'defaultTitle', title: 'Default Title', type: 'string' }),
        defineField({ name: 'defaultDescription', title: 'Default Description', type: 'text' }),
        defineField({ name: 'keywords', title: 'Keywords', type: 'string' }),
        defineField({ name: 'siteUrl', title: 'Site URL', type: 'string' }),
        defineField({ name: 'ogImage', title: 'OG Image', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'twitterHandle', title: 'Twitter Handle', type: 'string' }),
      ],
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      fields: [defineField({ name: 'googleAnalyticsId', title: 'Google Analytics ID', type: 'string' })],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})

const navbar = defineType({
  name: 'navbar',
  title: 'Navbar',
  type: 'document',
  fields: [
    defineField({
      name: 'navItems',
      title: 'Nav Items',
      type: 'array',
      of: [defineArrayMember({ type: 'navLink' }), defineArrayMember({ type: 'navDropdown' }), defineArrayMember({ type: 'navMegaMenu' })],
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      fields: [
        defineField({ name: 'text', title: 'Text', type: 'string' }),
        defineField({ name: 'href', title: 'URL', type: 'string' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Navbar' }) },
})

const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [defineArrayMember({ type: 'footerLinksColumn' }), defineArrayMember({ type: 'footerAccordionColumn' })],
    }),
    defineField({ name: 'bottomLinks', title: 'Bottom Links', type: 'array', of: [defineArrayMember({ type: 'linkItem' })] }),
  ],
  preview: { prepare: () => ({ title: 'Footer' }) },
})

const popup = defineType({
  name: 'popup',
  title: 'Popup',
  type: 'document',
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'buttonText', title: 'Button Text', type: 'string' }),
    defineField({ name: 'buttonHref', title: 'Button URL', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'delay', title: 'Delay (seconds)', type: 'number' }),
  ],
  preview: { prepare: () => ({ title: 'Popup' }) },
})

export const documentTypes = [page, siteSettings, navbar, footer, popup]
export const singletonTypeNames = ['siteSettings', 'navbar', 'footer', 'popup'] as const
