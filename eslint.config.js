export default {
    ignores: ["node_modules", "dist", "build", "coverage"],
    rules: {
        "no-unused-vars": "error",
        "max-len": ["warn", { "code": 100 }],
        "max-params": ["error", 3]
    }
};
