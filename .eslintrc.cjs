module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
    },
    plugins: ["@typescript-eslint", "import", "hbs"],
    extends: [
        "airbnb-base",
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript"
    ],
    rules: {
        "import/prefer-default-export": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        "no-console": "warn",
        "no-unused-vars": "off",
        "no-underscore-dangle": "off",
        "class-methods-use-this": "off",
        "import/extensions": ["error", "ignorePackages", {
            "ts": "never",
            "tsx": "never"
        }],
        "hbs/check-hbs-template-literals": "error"
    },
    settings: {
        "import/resolver": {
            typescript: {}
        }
    }
};
