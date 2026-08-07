import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pageName = process.argv[2]?.trim();

if (!pageName) {
  console.error('Usage: node scripts/generate-module-page.mjs <page-name>');
  process.exit(1);
}

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');

execSync(`ng generate component modules/${pageName} --type=component`, {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

execSync(`node scripts/add-module-route.mjs ${pageName}`, {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});
