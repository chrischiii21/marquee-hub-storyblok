// One-time migration: reads the existing local JSON content + images and
// writes them into Sanity as `page` documents + singleton settings documents.
// Safe to re-run (uses createOrReplace).
//
// Usage: bun run scripts/migrate-to-sanity.ts
// Requires PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, and a write-capable
// SANITY_API_TOKEN in .env (bun loads .env automatically).

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createClient } from '@sanity/client'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error(
    'Missing PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env — fill these in (see the Sanity project setup step) before running the migration.'
  )
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', token, useCdn: false })

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)
const isLocalImage = (v: unknown): v is string => typeof v === 'string' && v.startsWith('/')

// Converts a plain "#rrggbb" string into the object shape @sanity/color-input's
// `color` field expects, so the Studio can render a real swatch/picker for it.
function hexToColorValue(hex: string) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)

  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  const v = max
  const sv = max === 0 ? 0 : d / max

  return {
    _type: 'color',
    hex,
    alpha: 1,
    rgb: { r, g, b, a: 1 },
    hsl: { h, s, l, a: 1 },
    hsv: { h, s: sv, v, a: 1 },
  }
}

const ROOT = process.cwd()
const PAGES_DIR = path.join(ROOT, 'src/content/pages')
const SETTINGS_DIR = path.join(ROOT, 'src/content/settings')

// ---------- Read local content ----------

function walkPages(dir: string, base = dir): { slug: string; data: any }[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  let files: { slug: string; data: any }[] = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files = files.concat(walkPages(full, base))
    } else if (entry.name.endsWith('.json')) {
      const slug = path.relative(base, full).replace(/\\/g, '/').replace(/\.json$/, '')
      files.push({ slug, data: JSON.parse(readFileSync(full, 'utf-8')) })
    }
  }
  return files
}

const readJson = (file: string) => JSON.parse(readFileSync(path.join(SETTINGS_DIR, file), 'utf-8'))

// ---------- Image upload ----------

function collectImagePaths(pages: { data: any }[], site: any, navbarRaw: any, popupRaw: any) {
  const paths = new Set<string>()
  const add = (v: unknown) => { if (isLocalImage(v)) paths.add(v) }

  for (const { data } of pages) {
    for (const section of data.sections || []) {
      if (section.type === 'hero') { add(section.image); add(section.secondaryImage) }
      if (section.type === 'content') { add(section.image) }
      if (section.type === 'valueCards') { for (const c of section.cards || []) add(c.image) }
    }
  }

  add(site?.logo?.src)
  add(popupRaw?.image)
  for (const item of navbarRaw?.navItems || []) {
    if (item.type === 'megamenu') { for (const f of item.featured || []) add(f.image) }
  }

  return paths
}

async function uploadImages(paths: Set<string>) {
  const map = new Map<string, string>()
  for (const p of paths) {
    const filePath = path.join(ROOT, 'public', p)
    if (!existsSync(filePath)) {
      console.warn(`  ! missing file for ${p}, skipping`)
      continue
    }
    const asset = await client.assets.upload('image', readFileSync(filePath), { filename: path.basename(p) })
    map.set(p, asset._id)
    console.log(`  uploaded ${p}`)
  }
  return map
}

const resolveImage = (p: unknown, map: Map<string, string>) =>
  isLocalImage(p) && map.has(p) ? { _type: 'image', asset: { _type: 'reference', _ref: map.get(p)! } } : undefined

// ---------- Section transforms ----------

const sectionTypeMap: Record<string, string> = {
  hero: 'heroSection',
  features: 'featuresSection',
  content: 'contentSection',
  cta: 'ctaSection',
  faq: 'faqSection',
  valueCards: 'valueCardsSection',
  locations: 'locationsSection',
  contact: 'contactSection',
}

function transformSection(section: any, imageMap: Map<string, string>) {
  const sanityType = sectionTypeMap[section.type]
  if (!sanityType) {
    console.warn(`  ! unknown section type "${section.type}", skipping`)
    return null
  }
  const { type, ...rest } = section
  const out: any = { _type: sanityType, _key: key(), ...rest }

  if (sanityType === 'heroSection') {
    out.image = resolveImage(rest.image, imageMap)
    out.secondaryImage = resolveImage(rest.secondaryImage, imageMap)
  }

  if (sanityType === 'contentSection') {
    out.image = resolveImage(rest.image, imageMap)
    if (Array.isArray(rest.features)) {
      out.features = rest.features.map((f: any) =>
        typeof f === 'string'
          ? { _type: 'contentFeatureItem', _key: key(), text: f }
          : { _type: 'contentFeatureItem', _key: key(), text: f.text, icon: f.icon }
      )
    }
    if (Array.isArray(rest.slides)) {
      out.slides = rest.slides.map((s: any) => ({ _type: 'contentSlide', _key: key(), ...s }))
    }
  }

  if (sanityType === 'featuresSection' && Array.isArray(rest.features)) {
    out.features = rest.features.map((f: any) => ({ _type: 'featureItem', _key: key(), ...f }))
  }

  if (sanityType === 'faqSection' && Array.isArray(rest.faqs)) {
    out.faqs = rest.faqs.map((f: any) => ({ _type: 'faqItem', _key: key(), ...f }))
  }

  if (sanityType === 'valueCardsSection' && Array.isArray(rest.cards)) {
    out.cards = rest.cards.map((c: any) => ({
      _type: 'valueCard',
      _key: key(),
      icon: c.icon,
      title: c.title,
      description: c.description,
      image: resolveImage(c.image, imageMap),
    }))
  }

  if (sanityType === 'locationsSection' && Array.isArray(rest.locations)) {
    out.locations = rest.locations.map((l: any) => ({ _type: 'locationItem', _key: key(), ...l }))
  }

  return out
}

function buildPageDoc(slug: string, data: any, imageMap: Map<string, string>) {
  return {
    _id: `page-${slug.replace(/\//g, '-')}`,
    _type: 'page',
    title: data.title,
    name: data.name,
    city: data.city,
    slug: { _type: 'slug', current: slug },
    description: data.description,
    keywords: data.keywords,
    sections: (data.sections || []).map((s: any) => transformSection(s, imageMap)).filter(Boolean),
    // Only set when the source page actually has legal sections — an empty array
    // is truthy in the page template's `{legalSections && (...)}` check and would
    // render an empty legal-content block on every page otherwise.
    legalSections: data.legalSections
      ? data.legalSections.map((s: any) => ({ _type: 'legalSection', _key: key(), ...s }))
      : undefined,
  }
}

// ---------- Settings transforms ----------

function transformNavItems(items: any[], imageMap: Map<string, string>) {
  return (items || [])
    .map((item) => {
      if (item.type === 'link') return { _type: 'navLink', _key: key(), title: item.title, href: item.href }
      if (item.type === 'dropdown') {
        return {
          _type: 'navDropdown',
          _key: key(),
          title: item.title,
          items: (item.items || []).map((i: any) => ({ _type: 'navItem', _key: key(), ...i })),
        }
      }
      if (item.type === 'megamenu') {
        return {
          _type: 'navMegaMenu',
          _key: key(),
          title: item.title,
          href: item.href,
          sections: (item.sections || []).map((s: any) => ({
            _type: 'megaMenuSection',
            _key: key(),
            label: s.label,
            items: (s.items || []).map((i: any) => ({ _type: 'navItem', _key: key(), ...i })),
          })),
          featured: (item.featured || []).map((f: any) => ({
            _type: 'megaMenuFeatured',
            _key: key(),
            title: f.title,
            description: f.description,
            href: f.href,
            image: resolveImage(f.image, imageMap),
          })),
        }
      }
      return null
    })
    .filter(Boolean)
}

function transformFooterColumns(columns: any[]) {
  return (columns || [])
    .map((col) => {
      if (col.type === 'links') {
        return {
          _type: 'footerLinksColumn',
          _key: key(),
          title: col.title,
          links: (col.links || []).map((l: any) => ({ _type: 'linkItem', _key: key(), ...l })),
        }
      }
      if (col.type === 'accordion') {
        return {
          _type: 'footerAccordionColumn',
          _key: key(),
          title: col.title,
          href: col.href,
          sections: (col.sections || []).map((s: any) => ({
            _type: 'footerAccordionSection',
            _key: key(),
            label: s.label,
            items: (s.items || []).map((i: any) => ({ _type: 'linkItem', _key: key(), ...i })),
          })),
        }
      }
      return null
    })
    .filter(Boolean)
}

const withLinkKeys = (links: any[]) => (links || []).map((l) => ({ _type: 'linkItem', _key: key(), ...l }))

// ---------- Main ----------

async function main() {
  console.log('Reading local content...')
  const pages = walkPages(PAGES_DIR)
  const site = readJson('site.json')
  const navbarRaw = readJson('navbar.json')
  const footerRaw = readJson('footer.json')
  const popupRaw = readJson('popup.json')
  console.log(`Found ${pages.length} pages.`)

  const imagePaths = collectImagePaths(pages, site, navbarRaw, popupRaw)
  console.log(`Uploading ${imagePaths.size} unique images...`)
  const imageMap = await uploadImages(imagePaths)

  console.log('Building documents...')
  const pageDocs = pages.map(({ slug, data }) => buildPageDoc(slug, data, imageMap))

  const siteSettingsDoc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    business: site.business,
    location: site.location,
    contact: site.contact,
    colors: site.colors
      ? {
          primary: hexToColorValue(site.colors.primary),
          secondary: hexToColorValue(site.colors.secondary),
          tertiary: hexToColorValue(site.colors.tertiary),
          quaternary: hexToColorValue(site.colors.quaternary),
        }
      : undefined,
    logo: { image: resolveImage(site.logo?.src, imageMap), alt: site.logo?.alt },
    social: site.social,
    // ogImage is an `image` field in Sanity, but the source JSON only ever
    // held an external placeholder URL (not a local file we can upload) —
    // omit it and let it be set via the Studio's media library instead.
    seo: site.seo ? { ...site.seo, ogImage: undefined } : undefined,
    analytics: site.analytics,
  }
  const navbarDoc = {
    _id: 'navbar',
    _type: 'navbar',
    navItems: transformNavItems(navbarRaw.navItems, imageMap),
    ctaButton: navbarRaw.ctaButton,
  }
  const footerDoc = {
    _id: 'footer',
    _type: 'footer',
    description: footerRaw.description,
    columns: transformFooterColumns(footerRaw.columns),
    bottomLinks: withLinkKeys(footerRaw.bottomLinks),
  }
  const popupDoc = {
    _id: 'popup',
    _type: 'popup',
    enabled: popupRaw.enabled,
    title: popupRaw.title,
    description: popupRaw.description,
    buttonText: popupRaw.buttonText,
    buttonHref: popupRaw.buttonHref,
    image: resolveImage(popupRaw.image, imageMap),
    delay: popupRaw.delay,
  }

  console.log('Writing to Sanity...')
  let tx = client.transaction()
  for (const doc of [...pageDocs, siteSettingsDoc, navbarDoc, footerDoc, popupDoc]) {
    tx = tx.createOrReplace(doc as any)
  }
  await tx.commit()

  console.log(`Done. Migrated ${pageDocs.length} pages + 4 settings documents, ${imageMap.size} images.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
