import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sanity from '@sanity/astro';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://nienke.dev',
  integrations: [mdx(), tailwind(), sanity({
    projectId: 'vuh5pxn1',
    dataset: 'production',
    useCdn: false,
  }), react()],
});