import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, '../locales');
const OUTPUT_DIR = path.join(__dirname, '../dist');

function mergeDeep(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            target[key] = target[key] || {};
            mergeDeep(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

function buildNestedObject(relativePath, content) {
    const parts = relativePath.replace('.json', '').split(path.sep);
    const result = {};
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = {};
        current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = content;
    return result;
}

function loadLocaleFiles(localeDir, basePath = '') {
    const messages = {};
    const entries = fs.readdirSync(localeDir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(localeDir, entry.name);
        const relativePath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
            mergeDeep(messages, loadLocaleFiles(fullPath, relativePath));
        } else if (entry.name.endsWith('.json')) {
            const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            mergeDeep(messages, buildNestedObject(relativePath, content));
        }
    }

    return messages;
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const locales = fs.readdirSync(LOCALES_DIR).filter(name => 
    fs.statSync(path.join(LOCALES_DIR, name)).isDirectory()
);

for (const locale of locales) {
    const messages = loadLocaleFiles(path.join(LOCALES_DIR, locale));
    fs.writeFileSync(
        path.join(OUTPUT_DIR, `${locale}.json`),
        JSON.stringify(messages, null, 2)
    );
}
