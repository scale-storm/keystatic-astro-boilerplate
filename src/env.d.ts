/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: string;
  readonly KEYSTATIC_GITHUB_CLIENT_ID: string;
  readonly KEYSTATIC_GITHUB_CLIENT_SECRET: string;
  readonly KEYSTATIC_SECRET: string;
  readonly PREVIEW_GITHUB_TOKEN: string;
  readonly PUBLIC_GITHUB_REPO: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
