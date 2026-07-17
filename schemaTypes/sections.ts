import { defineArrayMember, defineField, defineType } from 'sanity'

// --- Nested item types ---

const featureItem = defineType({
  name: 'featureItem',
  title: 'Feature',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: { list: ['monitor', 'share', 'globe', 'target', 'tv', 'megaphone', 'dollar', 'palette'] },
    }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
  ],
  preview: { select: { title: 'title' } },
})

const contentFeatureItem = defineType({
  name: 'contentFeatureItem',
  title: 'Feature Bullet',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      description: 'Plain text or HTML (e.g. <a href="/x">link</a>) — rendered as-is.',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: ['check', 'mappin', 'clock', 'target', 'zap', 'globe', 'palette', 'trending', 'megaphone', 'google'],
      },
    }),
  ],
  preview: { select: { title: 'text' } },
})

const contentSlide = defineType({
  name: 'contentSlide',
  title: 'Slide',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
  ],
  preview: { select: { title: 'title' } },
})

const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string' }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      description: 'Plain text or HTML (e.g. <a href="/x">link</a>) — rendered as-is.',
    }),
  ],
  preview: { select: { title: 'question' } },
})

const valueCard = defineType({
  name: 'valueCard',
  title: 'Value Card',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          'mappin', 'users', 'dollar', 'sparkles', 'award', 'target', 'zap', 'globe',
          'trending', 'heart', 'shield', 'clock', 'message', 'palette', 'rocket', 'settings', 'wrench',
        ],
      },
    }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
  ],
  preview: { select: { title: 'title', media: 'image' } },
})

const locationItem = defineType({
  name: 'locationItem',
  title: 'Location',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'href', title: 'URL', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'string' }),
  ],
  preview: { select: { title: 'name' } },
})

// --- Section types (one per `type` value in the page builder) ---

const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string', description: 'Used on the homepage hero.' }),
    defineField({ name: 'description', title: 'Description', type: 'text', description: 'Used on interior page heroes.' }),
    defineField({ name: 'buttonText', title: 'Button Text', type: 'string' }),
    defineField({ name: 'buttonHref', title: 'Button URL', type: 'string' }),
    defineField({ name: 'ctaText', title: 'CTA Text', type: 'string', description: 'Used on interior page heroes.' }),
    defineField({ name: 'ctaHref', title: 'CTA URL', type: 'string', description: 'Used on interior page heroes.' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
    defineField({ name: 'secondaryImage', title: 'Secondary Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'secondaryImageAlt', title: 'Secondary Image Alt Text', type: 'string' }),
  ],
  preview: { select: { title: 'title', media: 'image' } },
})

const featuresSection = defineType({
  name: 'featuresSection',
  title: 'Features',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'columns', title: 'Columns', type: 'number', options: { list: [2, 3, 4] } }),
    defineField({ name: 'variant', title: 'Variant', type: 'string', options: { list: ['default', 'numbered'] } }),
    defineField({ name: 'features', title: 'Features', type: 'array', of: [defineArrayMember({ type: 'featureItem' })] }),
  ],
  preview: { select: { title: 'title' } },
})

const contentSection = defineType({
  name: 'contentSection',
  title: 'Content',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'secondaryDescription', title: 'Secondary Description', type: 'text' }),
    defineField({ name: 'slides', title: 'Slides', type: 'array', of: [defineArrayMember({ type: 'contentSlide' })] }),
    defineField({ name: 'features', title: 'Feature Bullets', type: 'array', of: [defineArrayMember({ type: 'contentFeatureItem' })] }),
    defineField({ name: 'buttonText', title: 'Button Text', type: 'string' }),
    defineField({ name: 'buttonHref', title: 'Button URL', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
    defineField({ name: 'imagePosition', title: 'Image Position', type: 'string', options: { list: ['left', 'right'] } }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: ['simple', 'card', 'dark', 'gradient', 'minimal'] },
    }),
  ],
  preview: { select: { title: 'title', media: 'image' } },
})

const ctaSection = defineType({
  name: 'ctaSection',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'buttonText', title: 'Button Text', type: 'string' }),
    defineField({ name: 'buttonHref', title: 'Button URL', type: 'string' }),
    defineField({ name: 'secondaryButtonText', title: 'Secondary Button Text', type: 'string' }),
    defineField({ name: 'secondaryButtonHref', title: 'Secondary Button URL', type: 'string' }),
    defineField({ name: 'variant', title: 'Variant', type: 'string', options: { list: ['bold', 'split', 'card', 'banner'] } }),
  ],
  preview: { select: { title: 'title' } },
})

const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'variant', title: 'Variant', type: 'string', options: { list: ['accordion', 'cards', 'minimal'] } }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', of: [defineArrayMember({ type: 'faqItem' })] }),
  ],
  preview: { select: { title: 'title' } },
})

const valueCardsSection = defineType({
  name: 'valueCardsSection',
  title: 'Value Cards',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: ['cards', 'minimal', 'overlay', 'marquee'] },
    }),
    defineField({ name: 'cards', title: 'Cards', type: 'array', of: [defineArrayMember({ type: 'valueCard' })] }),
  ],
  preview: { select: { title: 'title' } },
})

const locationsSection = defineType({
  name: 'locationsSection',
  title: 'Locations',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: ['overlay', 'split', 'cards', 'full', 'half'] },
    }),
    defineField({ name: 'locations', title: 'Locations', type: 'array', of: [defineArrayMember({ type: 'locationItem' })] }),
    defineField({
      name: 'mapCenter',
      title: 'Map Center',
      type: 'object',
      fields: [
        defineField({ name: 'lat', title: 'Latitude', type: 'number' }),
        defineField({ name: 'lng', title: 'Longitude', type: 'number' }),
      ],
    }),
    defineField({ name: 'mapUrl', title: 'Custom Map Embed URL', type: 'string' }),
  ],
  preview: { select: { title: 'title' } },
})

const contactSection = defineType({
  name: 'contactSection',
  title: 'Contact',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'secondaryDescription', title: 'Secondary Description', type: 'text' }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Info',
      type: 'object',
      fields: [
        defineField({ name: 'phone', title: 'Phone (tel: link)', type: 'string' }),
        defineField({ name: 'phoneFormatted', title: 'Phone (display)', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'location', title: 'Location', type: 'string' }),
      ],
    }),
    defineField({ name: 'submitText', title: 'Submit Button Text', type: 'string' }),
    defineField({ name: 'variant', title: 'Variant', type: 'string', options: { list: ['default', 'split', 'card'] } }),
  ],
  preview: { select: { title: 'title' } },
})

export const sectionTypes = [
  featureItem,
  contentFeatureItem,
  contentSlide,
  faqItem,
  valueCard,
  locationItem,
  heroSection,
  featuresSection,
  contentSection,
  ctaSection,
  faqSection,
  valueCardsSection,
  locationsSection,
  contactSection,
]

export const sectionTypeNames = [
  'heroSection',
  'featuresSection',
  'contentSection',
  'ctaSection',
  'faqSection',
  'valueCardsSection',
  'locationsSection',
  'contactSection',
] as const
