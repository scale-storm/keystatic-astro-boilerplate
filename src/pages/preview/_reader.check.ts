import keystaticConfig from '../../../keystatic.config.ts';
import {
  createPreviewReader,
  getGitHubReaderOptions,
  safeErrorMessage,
} from './_reader.ts';

const repo = process.env.PUBLIC_GITHUB_REPO;
assert(repo, 'PUBLIC_GITHUB_REPO must be set for this check');
const env = { PUBLIC_GITHUB_REPO: repo };
const options = getGitHubReaderOptions(env, 'main');
assert(
  options.repo === repo && options.ref === 'main' && !('token' in options),
  'reader options must contain the public repo and branch, without a token',
);

const reader = createPreviewReader(keystaticConfig, env, 'main');
assert(
  typeof reader.singletons.home.read === 'function',
  'home reader must exist',
);
assert(
  typeof reader.collections.posts.read === 'function',
  'posts reader must exist',
);
assert(
  safeErrorMessage(new Error('Rejected token fake-secret'), 'fake-secret') ===
    'Rejected token [redacted]',
  'preview errors must redact the configured token',
);
console.log('preview reader wiring: ok (public repo, no token)');

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
