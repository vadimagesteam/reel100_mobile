/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'all',
  arrowParens: 'always',
  bracketSpacing: true,
  jsxSingleQuote: false,
  bracketSameLine: false,
  tabWidth: 2,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindConfig: './tailwind.config.js',
};
