import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pageName = process.argv[2]?.trim();

if (!pageName) {
  console.error('Usage: node scripts/add-module-route.mjs <page-name>');
  process.exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(pageName)) {
  console.error(
    `Invalid page name "${pageName}". Use kebab-case (e.g. login, daily-tasks).`,
  );
  process.exit(1);
}

const toPascalCase = (value) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const componentClass = `${toPascalCase(pageName)}Component`;
const routesPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'app',
  'app.routes.ts',
);

const content = readFileSync(routesPath, 'utf8');

if (content.includes(`path: '${pageName}'`)) {
  console.log(`Route "${pageName}" already exists in app.routes.ts`);
  process.exit(0);
}

const routeBlock = `  {
    path: '${pageName}',
    loadComponent: () =>
      import('./modules/${pageName}/${pageName}.component').then(
        (m) => m.${componentClass},
      ),
  },
`;

const updated = content.replace(/\];\s*$/, `${routeBlock}];\n`);

if (updated === content) {
  console.error('Could not find routes array closing bracket in app.routes.ts');
  process.exit(1);
}

writeFileSync(routesPath, updated, 'utf8');
console.log(`Added route "${pageName}" -> ${componentClass}`);
