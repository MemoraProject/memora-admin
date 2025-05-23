/** @type {import("eslint").Linter.Config} */
// const config = {
//   parser: "@typescript-eslint/parser",
//   parserOptions: {
//     project: true,
//   },
//   plugins: ["@typescript-eslint"],
//   extends: [
//     "next/core-web-vitals",
//     "plugin:@typescript-eslint/recommended-type-checked",
//     // "plugin:@typescript-eslint/stylistic-type-checked",
//   ],
//   rules: {
//     "@typescript-eslint/array-type": "off",
//     "@typescript-eslint/consistent-type-definitions": "off",
//     "@typescript-eslint/consistent-type-imports": [
//       "warn",
//       {
//         prefer: "type-imports",
//         fixStyle: "inline-type-imports",
//       },
//     ],
//     "@typescript-eslint/no-unused-vars": [
//       "warn",
//       {
//         argsIgnorePattern: "^_",
//       },
//     ],
//     "@typescript-eslint/require-await": "off",
//     "@typescript-eslint/no-misused-promises": [
//       "error",
//       {
//         checksVoidReturn: {
//           attributes: false,
//         },
//       },
//     ],
//   },
// };

const config = {
  $schema: "https://json.schemastore.org/eslintrc",
  root: true,
  extends: [
    "next/core-web-vitals",
    "turbo",
    "prettier",
    "plugin:tailwindcss/recommended",
  ],
  plugins: ["tailwindcss"],
  ignorePatterns: ["**/fixtures/**"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/classnames-order": "error",
  },
  settings: {
    tailwindcss: {
      callees: ["cn", "cva"],
      config: "tailwind.config.cjs",
    },
    next: {
      rootDir: ["apps/*/"],
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
    },
  ],
};

module.exports = config;
