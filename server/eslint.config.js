import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: {
            globals: {
                ...globals.node, // Add Node.js globals
                ...globals.browser, // Add Browser globals
            },
        },
    },
    pluginJs.configs.recommended, // Use the recommended ESLint config for JS
    {
        rules: {
            // Warn when using `console.log` or other console methods in production code
            "no-console": [
                "warn",
                {
                    allow: ["warn", "error", "log"],
                },
            ],
            // Ensure consistent use of double quotes for strings (can be customized)
            indent: ["error", 4],
            "prefer-const": "error",
            "no-process-exit": "warn",
            "no-eval": "error",
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            strict: ["error", "global"],
            eqeqeq: ["error", "always"],
            "array-callback-return": "error",
            "no-new-func": "error",
            semi: ["error", "always"],
            "no-process-env": "off",
            "prefer-template": "warn",
            "no-buffer-constructor": "warn",
            "no-with": "error",
            "no-path-concat": "warn",
        },
    },
];
