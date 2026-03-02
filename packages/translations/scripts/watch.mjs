import { watch } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, '../locales');
const cwd = path.join(__dirname, '..');

execSync('node scripts/build.js', { cwd, stdio: 'inherit' });

let buildTimeout;

watch(LOCALES_DIR, { recursive: true }, (_, filename) => {
    if (filename?.endsWith('.json')) {
        clearTimeout(buildTimeout);
        buildTimeout = setTimeout(() => {
            execSync('node scripts/build.js', { cwd, stdio: 'inherit' });
        }, 300);
    }
});
