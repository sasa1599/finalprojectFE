// eslint.config.mjs
import { globals } from "globals";
import js from "@eslint/js";
import * as tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect", // Deteksi versi React secara otomatis
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Matikan aturan ini karena JSX runtime baru
      "@typescript-eslint/no-unused-vars": "off" // Turn off unused variables warning
    },
  },
];