import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

async function getAdapter() {
  const requested = process.env.DEPLOY_ADAPTER;

  if (requested === 'cloudflare') {
    const { default: cloudflare } = await import('@astrojs/cloudflare');
    return cloudflare();
  }

  if (requested === 'node') {
    const { default: node } = await import('@astrojs/node');
    return node({ mode: 'standalone' });
  }

  if (requested) {
    console.warn(
      `Unknown DEPLOY_ADAPTER "${requested}"; auto-detecting the deployment environment.`,
    );
  }

  if (
    process.env.WORKERS_CI !== undefined ||
    process.env.CF_PAGES !== undefined
  ) {
    const { default: cloudflare } = await import('@astrojs/cloudflare');
    return cloudflare();
  }

  const { default: node } = await import('@astrojs/node');
  return node({ mode: 'standalone' });
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: await getAdapter(),
  integrations: [react(), markdoc(), keystatic()],
  server: { port: 4341 },
  vite: { server: { allowedHosts: ['mac-studio.tailf993b3.ts.net'] } },
});
