import { watch } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');
const appDir = join(rootDir, 'app');

function generateRoutes() {
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    execSync('node lib/scripts/generate-routes.mjs', { 
      stdio: 'inherit',
      cwd: rootDir
    });
}

generateRoutes();

watch(appDir, { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith('page.tsx') || filename.endsWith('page.ts')) {
    generateRoutes();
  }
});