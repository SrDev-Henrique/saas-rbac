/**
 * @type {import("prettier").Config}
 */

const config = {
    plugins: ["prettier-plugin-tailwindcss"],
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: true,
    quoteProps: "as-needed",
    jsxSingleQuote: false,
    trailingCome: "es5",
    bracketSpacing: true,
    arrowParams: 'always',
    endOfLine: "auto",
    bracketSameLine: false,
};

export default config;