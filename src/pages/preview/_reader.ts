import type {
  Collection,
  ComponentSchema,
  Config,
  Singleton,
} from '@keystatic/core';
import { createGitHubReader } from '@keystatic/core/reader/github';

export interface PreviewEnv {
  PUBLIC_GITHUB_REPO?: string;
  PREVIEW_GITHUB_TOKEN?: string;
}

export function getGitHubReaderOptions(env: PreviewEnv, branch: string) {
  const repo = env.PUBLIC_GITHUB_REPO;
  if (!repo || !/^[^/]+\/[^/]+$/.test(repo)) {
    throw new Error('PUBLIC_GITHUB_REPO must be set in owner/name form');
  }
  if (!branch) throw new Error('A branch is required');

  return {
    repo: repo as `${string}/${string}`,
    ref: branch,
    ...(env.PREVIEW_GITHUB_TOKEN
      ? { token: env.PREVIEW_GITHUB_TOKEN }
      : {}),
  };
}

export function createPreviewReader<
  Collections extends Record<
    string,
    Collection<Record<string, ComponentSchema>, string>
  >,
  Singletons extends Record<
    string,
    Singleton<Record<string, ComponentSchema>>
  >,
>(
  config: Config<Collections, Singletons>,
  env: PreviewEnv,
  branch: string,
) {
  return createGitHubReader(config, getGitHubReaderOptions(env, branch));
}

export async function getRuntimePreviewEnv(
  fallback: PreviewEnv,
): Promise<PreviewEnv> {
  try {
    // This platform module exists only in the Worker runtime; Node dev uses the fallback.
    const workerModule = 'cloudflare:workers';
    const { env } = await import(workerModule);
    return {
      PUBLIC_GITHUB_REPO: env.PUBLIC_GITHUB_REPO,
      PREVIEW_GITHUB_TOKEN: env.PREVIEW_GITHUB_TOKEN,
    };
  } catch {
    return fallback;
  }
}

export function safeErrorMessage(error: unknown, token?: string) {
  const message = error instanceof Error ? error.message : String(error);
  return token ? message.replaceAll(token, '[redacted]') : message;
}
