import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        // files: ["scripts/**/*.js", "__tests__/**/*.js"],
        files: ["scripts/**/*.js"],
        plugins: { js, },
        extends: ["js/recommended"],

        rules: {
            // Enforce camelcase for variable naming
            "camelcase": ["error", { properties: "always" }],
            // Enforce string templating instead of concatenation
            "prefer-template": ["error"],
            // Enforce type-safe === instead of ==
            "eqeqeq": ["error", "always"],
            // Prefer const whenever possible
            "prefer-const": "error"
        },
    },

    {
        // Same rules, but also make it not mad at jest
        files: ["__tests__/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
            },
        },
        rules: {
            "camelcase": ["error", { properties: "always" }],
            "prefer-template": ["error"],
            "eqeqeq": ["error", "always"],
            "prefer-const": "error"
        },
    },

    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: { globals: globals.browser },
    },
]);
