import { sanityClient } from 'sanity:client'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { Image } from 'sanity'

const builder = createImageUrlBuilder(sanityClient)

/**
 * Resolves a Sanity image asset reference to a CDN URL string.
 * Passing through non-image values (e.g. already-a-string, undefined) keeps
 * callers safe to run over fields that aren't guaranteed to be Sanity images.
 */
export function urlFor(source?: Image | string | null, width?: number): string | undefined {
  if (!source) return undefined
  if (typeof source === 'string') return source
  let img = builder.image(source).auto('format')
  if (width) img = img.width(width)
  return img.url()
}
