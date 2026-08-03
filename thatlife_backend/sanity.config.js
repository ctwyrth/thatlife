// Sanity Studio v3 root config for the thatLife content project.
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'thatlife',
  title: 'thatLife',

  projectId: 'nnu4f987',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool({defaultApiVersion: '2021-11-16'}),
  ],

  schema: {
    types: schemaTypes,
  },
})
