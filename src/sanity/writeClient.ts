import { createClient } from '@sanity/client';

export const writeClient = createClient({
  projectId: 'vuh5pxn1',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: import.meta.env.SANITY_WRITE_TOKEN,
});
