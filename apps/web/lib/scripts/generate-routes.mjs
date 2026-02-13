import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');

const FILE_NAME = 'routes.ts';
const CONFIG_FILE = './config/routes.config';

function extractTypeFromFile(filePath) {
    const content = readFileSync(filePath, 'utf-8');

    try {
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
        });

        let queryType = null;
        let functionName = null;

        traverse.default(ast, {
            ExportNamedDeclaration(path) {
                if (path.node.declaration?.type === 'TSTypeAliasDeclaration' &&
                    path.node.declaration.id.name === 'Query') {
                    const typeAnnotation = path.node.declaration.typeAnnotation;
                    if (typeAnnotation.type === 'TSTypeLiteral') {
                        queryType = {};
                        typeAnnotation.members.forEach(member => {
                            if (member.type === 'TSPropertySignature') {
                                const key = member.key.name;
                                const type = member.typeAnnotation?.typeAnnotation;
                                queryType[key] = getTypeName(type);
                            }
                        });
                    }
                }
            },
            ExportDefaultDeclaration(path) {
                if (path.node.declaration.type === 'FunctionDeclaration') {
                    functionName = path.node.declaration.id?.name;
                } else if (path.node.declaration.type === 'Identifier') {
                    functionName = path.node.declaration.name;
                }
            },
            VariableDeclaration(path) {
                if (path.parent.type === 'ExportDefaultDeclaration') {
                    functionName = path.node.declarations[0]?.id?.name;
                }
            }
        });

        return { queryType, functionName };
    } catch {
        return { queryType: null, functionName: null };
    }
}

function getTypeName(type) {
    if (!type) return 'string';

    switch (type.type) {
        case 'TSStringKeyword':
            return 'string';
        case 'TSNumberKeyword':
            return 'number';
        case 'TSBooleanKeyword':
            return 'boolean';
        case 'TSUnionType':
            return type.types.map(t => getTypeName(t)).join(' | ');
        default:
            return 'string';
    }
}

function shouldProcessDirectory(item, stat) {
    return stat.isDirectory() && !item.startsWith('_') && !item.startsWith('(');
}

function shouldProcessPage(item) {
    return item === 'page.tsx' || item === 'page.ts';
}

function extractParams(routePath) {
    const params = [];
    // eslint-disable-next-line sonarjs/slow-regex
    const regex = /\[([^\]]+)\]/g;
    let match;
    while ((match = regex.exec(routePath)) !== null) {
        params.push(match[1]);
    }
    return params;
}

function buildRoutePath(baseDir, dir) {
    const relativePath = relative(baseDir, dir);
    const routePath = `/${relativePath.replace(/\\/g, '/')}`;
    return routePath === '/.' ? '/' : routePath;
}

function scanAppDir(dir, baseDir = 'app', routes = {}) {
    const items = readdirSync(dir);

    for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (shouldProcessDirectory(item, stat)) {
            scanAppDir(fullPath, baseDir, routes);
        } else if (shouldProcessPage(item)) {
            const { queryType, functionName } = extractTypeFromFile(fullPath);
            if (!functionName) continue;

            const routePath = buildRoutePath(baseDir, dir);
            const params = extractParams(routePath);

            routes[functionName] = {
                path: routePath,
                params,
                types: queryType || {}
            };
        }
    }

    return routes;
}

function generateHeader() {
    return `// NOTE: This file is auto-generated\n` +
           `// Don't modify manually - your changes will be overwritten\n` +
           `// To regenerate it: pnpm generate:routes\n\n` +
           `import { routesConfig } from '${CONFIG_FILE}';\n\n`;
}

function generateBuildRouteFunction() {
    return `function buildRoute(path: string, params?: Record<string, string | number>): string {\n` +
           `  if (!params || Object.keys(params).length === 0) {\n` +
           `    return path;\n` +
           `  }\n\n` +
           `  const mode = routesConfig.mode;\n` +
           `  const preserved = routesConfig.preservedParams;\n` +
           `  const queryParams: Record<string, string> = {};\n` +
           `  let finalPath = path;\n\n` +
           `  Object.entries(params).forEach(([key, value]) => {\n` +
           `    if (mode === 'static' && !preserved.includes(key)) {\n` +
           `      queryParams[key] = String(value);\n` +
           `    } else {\n` +
           `      finalPath = finalPath.replace(\`[\${key}]\`, String(value));\n` +
           `    }\n` +
           `  });\n\n` +
           `  const query = new URLSearchParams(queryParams).toString();\n` +
           `  return query ? \`\${finalPath}?\${query}\` : finalPath;\n` +
           `}\n\n`;
}

function generateTypeDefinitions(routes) {
    let content = '';
    for (const [name, { params, types }] of Object.entries(routes)) {
        if (params.length > 0) {
            content += `type ${name}Params = {\n`;
            params.forEach(param => {
                const type = types[param] || 'string | number';
                content += `  ${param}: ${type};\n`;
            });
            content += `};\n\n`;

            if (params.includes('locale')) {
                content += `type ${name}ParamsOptionalLocale = Omit<${name}Params, 'locale'> & { locale?: ${name}Params['locale'] };\n\n`;
            }
        }
    }
    return content;
}

function generateRouteFunctions(routes) {
    let content = '';
    for (const [name, { path, params }] of Object.entries(routes)) {
        const hasParams = params.length > 0;
        const hasLocale = params.includes('locale');
        const paramsType = hasParams ? `${name}Params` : '';
        const paramsArg = hasParams ? `params: ${paramsType}` : '';

        content += `function ${name}(${paramsArg}): string {\n`;

        if (hasParams) {
            content += `  return buildRoute('${path}', params);\n`;
        } else {
            content += `  return '${path}';\n`;
        }

        content += `}\n\n`;

        if (hasLocale) {
            content += `function ${name}WithDefaultLocale(params: ${name}ParamsOptionalLocale, defaultLocale: string): string {\n`;
            content += `  return ${name}({ ...params, locale: params.locale || defaultLocale } as ${name}Params);\n`;
            content += `}\n\n`;
        }
    }
    return content;
}

function generateExports(routes) {
    let content = '';
    content += `export const routes = {\n`;
    Object.keys(routes).forEach(name => {
        content += `  ${name},\n`;
    });
    content += `} as const;\n\n`;

    content += `export const routesWithDefaultLocale = {\n`;
    Object.entries(routes).forEach(([name, { params }]) => {
        if (params.includes('locale')) {
            content += `  ${name}: ${name}WithDefaultLocale,\n`;
        }
    });
    content += `} as const;\n\n`;

    content += `export type RouteName = keyof typeof routes;\n`;
    return content;
}

function generateRoutesFile() {
    const appDir = join(rootDir, 'app');
    const routes = scanAppDir(appDir);

    let fileContent = generateHeader();
    fileContent += generateBuildRouteFunction();
    fileContent += generateTypeDefinitions(routes);
    fileContent += generateRouteFunctions(routes);
    fileContent += generateExports(routes);

    const outputPath = join(rootDir, 'lib', FILE_NAME);
    writeFileSync(outputPath, fileContent, 'utf-8');
}

generateRoutesFile();