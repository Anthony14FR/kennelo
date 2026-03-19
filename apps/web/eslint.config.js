import { nextJsConfig } from "@workspace/eslint-config/next-js"

/** @type {import("eslint").Linter.Config} */
export default [
    {
        ignores: [".next/**", ".turbo/**", "node_modules/**", "android/**", "ios/**"],
    },
    ...nextJsConfig,
    {
        files: ["e2e/**/*.ts", "playwright.config.ts"],
        rules: {
            "sonarjs/no-duplicate-string": "off",
            "sonarjs/no-hardcoded-passwords": "off",
            "turbo/no-undeclared-env-vars": "off",
        },
    },
]
