import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
  name: 'default',
  title: 'nienke.dev',
  projectId: 'vuh5pxn1',
  dataset: 'production',
  plugins: [structureTool({ structure }), visionTool(), codeInput()],
  schema: {
    types: schemaTypes,
  },
});
