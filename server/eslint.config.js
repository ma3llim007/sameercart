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
                    allow: ["warn", "error"],
                },
            ],
            quotes: ["error", "double"],
            indent: ["error", 4],
            "prefer-const": "error",
            "no-process-exit": "warn",
            "no-eval": "error",
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
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 2 }],
            "require-await": "warn",
            "no-extend-native": "warn",
            "block-spacing": ["error", "always"],
            "no-extra-semi": "error",
            "no-useless-escape": "warn",
            "no-extra-bind": "warn",
            "no-shadow-restricted-names": "error",
            "arrow-parens": ["error", "always"],
            "no-await-in-loop": "off",
            "no-debugger": "warn",
        },
    },
];
