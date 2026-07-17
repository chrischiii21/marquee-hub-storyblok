import type { StructureBuilder, StructureResolver } from 'sanity/structure'
import { singletonTypeNames } from './documents'

const singletonTitles: Record<string, string> = {
  siteSettings: 'Site Settings',
  navbar: 'Navbar',
  footer: 'Footer',
  popup: 'Popup',
}

// Groups the flat `page` document list by URL slug pattern, so the Studio
// sidebar shows categories instead of ~22 pages in one list.
const pageGroups: { title: string; filter: string }[] = [
  { title: 'Home & Company', filter: `slug.current in ["index", "about", "contact"]` },
  { title: 'Locations', filter: `slug.current == "locations" || slug.current match "locations/*"` },
  {
    title: 'Solutions & Services',
    filter: `!(slug.current in ["index", "about", "contact", "locations", "privacy", "terms"]) && !(slug.current match "locations/*")`,
  },
  { title: 'Legal', filter: `slug.current in ["privacy", "terms"]` },
]

function pageGroupItem(S: StructureBuilder, title: string, filter: string) {
  return S.listItem()
    .title(title)
    .child(
      S.documentList()
        .title(title)
        .schemaType('page')
        .filter(`_type == "page" && (${filter})`),
    )
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items(pageGroups.map((g) => pageGroupItem(S, g.title, g.filter))),
        ),
      S.divider(),
      ...singletonTypeNames.map((type) =>
        S.listItem()
          .title(singletonTitles[type])
          .id(type)
          .child(S.document().schemaType(type).documentId(type)),
      ),
    ])
