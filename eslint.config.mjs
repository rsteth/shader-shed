import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // Allow explicit any for regl types which require it
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    ignores: [".next/*", "node_modules/*"],
  },
];
