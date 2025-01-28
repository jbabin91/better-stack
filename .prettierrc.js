/** @type {import("prettier").Config} */
export default {
  singleQuote: true,
  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './packages/ui/src/styles/main.css',
};
