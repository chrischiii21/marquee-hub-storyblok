import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './schemaTypes'
import { structure } from './schemaTypes/structure'

// This file is loaded in two very different contexts:
// 1. Plain Node, via the `sanity` CLI (e.g. `sanity schema deploy`) — has
//    `process.env` but no Vite, so `import.meta.env` is never populated.
// 2. The browser, once @sanity/astro bundles this into the embedded /admin
//    Studio route via Vite — has `import.meta.env.PUBLIC_*` (statically
//    inlined at build time) but no `process` global at all.
// `typeof process !== 'undefined'` guards against the ReferenceError in the
// browser; optional chaining guards against `import.meta.env` being
// undefined under plain Node.
const projectId =
  (typeof process !== 'undefined' && process.env.PUBLIC_SANITY_PROJECT_ID) ||
  import.meta.env?.PUBLIC_SANITY_PROJECT_ID
const dataset =
  (typeof process !== 'undefined' && process.env.PUBLIC_SANITY_DATASET) ||
  import.meta.env?.PUBLIC_SANITY_DATASET ||
  'production'

export default defineConfig({
  name: 'marquee-hub-template',
  title: 'Marquee Hub',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool(), colorInput()],
  schema: {
    types: schemaTypes,
  },
})
