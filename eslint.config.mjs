import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["**/built/", "**/built_raw/", "**/coverage/"],
  },
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        it: true,
        describe: true,
        expect: true,
        beforeAll: true,
        afterAll: true,
        beforeEach: true,
        afterEach: true,
        jest: true,
      },

      parser: tsParser,
      ecmaVersion: 8,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      curly: 2,
      "no-const-assign": 2,
      "no-dupe-class-members": 2,
      "no-else-return": 2,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-inner-declarations": 2,
      "no-lonely-if": 2,
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "no-undef": "off", // Typescript covers this
      "no-unneeded-ternary": 2,
      "no-unreachable": 2,
      "no-unused-expressions": 2,
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        2,
        {
          args: "none",
          caughtErrors: "none",
        },
      ],

      "no-useless-return": 2,
      "no-var": 2,
      "@typescript-eslint/no-var-requires": "off",
      "one-var": [2, "never"],
      "prefer-arrow-callback": 2,
      "prefer-const": 2,
      "prefer-promise-reject-errors": 2,
      "sort-vars": 2,
      strict: [2, "global"],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.js"],

    rules: {
      "@typescript-eslint/no-empty-function": "off",
    },
  },
];
