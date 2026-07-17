import { defineArrayMember, defineField, defineType } from 'sanity'

// --- Shared small pieces ---

const linkItem = defineType({
  name: 'linkItem',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'href', title: 'URL', type: 'string' }),
  ],
})

const navItem = defineType({
  name: 'navItem',
  title: 'Nav Item',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'href', title: 'URL', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'string' }),
    defineField({ name: 'icon', title: 'Icon', type: 'string' }),
  ],
})

const megaMenuSection = defineType({
  name: 'megaMenuSection',
  title: 'Menu Section',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({ type: 'navItem' })] }),
  ],
})

const megaMenuFeatured = defineType({
  name: 'megaMenuFeatured',
  title: 'Featured Item',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'string' }),
    defineField({ name: 'href', title: 'URL', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image' }),
  ],
})

// --- Navbar nav item variants ---

const navLink = defineType({
  name: 'navLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'href', title: 'URL', type: 'string' }),
  ],
  preview: { select: { title: 'title', subtitle: 'href' } },
})

const navDropdown = defineType({
  name: 'navDropdown',
  title: 'Dropdown',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({ type: 'navItem' })] }),
  ],
  preview: { select: { title: 'title' } },
})

const navMegaMenu = defineType({
  name: 'navMegaMenu',
  title: 'Mega Menu',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'href', title: 'URL', type: 'string' }),
    defineField({ name: 'sections', title: 'Sections', type: 'array', of: [defineArrayMember({ type: 'megaMenuSection' })] }),
    defineField({ name: 'featured', title: 'Featured', type: 'array', of: [defineArrayMember({ type: 'megaMenuFeatured' })] }),
  ],
  preview: { select: { title: 'title' } },
})

// --- Footer column variants ---

const footerLinksColumn = defineType({
  name: 'footerLinksColumn',
  title: 'Links Column',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'links', title: 'Links', type: 'array', of: [defineArrayMember({ type: 'linkItem' })] }),
  ],
  preview: { select: { title: 'title' } },
})

const footerAccordionSection = defineType({
  name: 'footerAccordionSection',
  title: 'Accordion Section',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({ type: 'linkItem' })] }),
  ],
})

const footerAccordionColumn = defineType({
  name: 'footerAccordionColumn',
  title: 'Accordion Column',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'href', title: 'URL', type: 'string' }),
    defineField({ name: 'sections', title: 'Sections', type: 'array', of: [defineArrayMember({ type: 'footerAccordionSection' })] }),
  ],
  preview: { select: { title: 'title' } },
})

const legalSection = defineType({
  name: 'legalSection',
  title: 'Legal Section',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'content', title: 'Content', type: 'text' }),
    defineField({ name: 'items', title: 'List Items', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
  ],
  preview: { select: { title: 'title' } },
})

export const objectTypes = [
  linkItem,
  navItem,
  megaMenuSection,
  megaMenuFeatured,
  navLink,
  navDropdown,
  navMegaMenu,
  footerLinksColumn,
  footerAccordionSection,
  footerAccordionColumn,
  legalSection,
]
