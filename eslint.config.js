import parser from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";

export default [
    {
        files: ["**/*.ts", "**/*.tsx"],
        ignores: ["dist/**", "node_modules/**"],
        languageOptions: {
            parser,
            parserOptions: {
                sourceType: "module",
                ecmaVersion: "latest"
            }
        },
        plugins: {
            "@typescript-eslint": pluginTs
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "max-len": ["warn", {code: 140}],
            "max-params": ["warn", 6]
        }
    }
];
