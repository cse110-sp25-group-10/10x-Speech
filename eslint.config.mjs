import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["scripts/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
        rules: {
            camelcase: ["error", { properties: "always" }],
        },
    },
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: { globals: globals.browser },
    },
]);
