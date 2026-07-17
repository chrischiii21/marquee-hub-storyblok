import { objectTypes } from './objects'
import { sectionTypes } from './sections'
import { documentTypes } from './documents'

export const schemaTypes = [...objectTypes, ...sectionTypes, ...documentTypes]
