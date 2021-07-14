module.exports = {
    "extends": [
        "airbnb-typescript",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    "plugins": [
        "sort-imports-es6-autofix",
        "import"
    ],
    "rules": {
        "sort-imports": "off",
        "import/prefer-default-export": "off",
        "react/require-default-props": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "react/jsx-props-no-spreading": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["error"],
        "react/no-array-index-key": "off",
        "no-console": "off",
        "react/no-this-in-sfc": "off", // Bugged, gets triggered by non-SFC functions
        "no-param-reassign": "off",
        "sort-imports-es6-autofix/sort-imports-es6": "error",
        "max-len": ["error", { "code": 120, "ignoreStrings": false, "tabWidth": 4, "ignoreTemplateLiterals": true }],
        "no-multiple-empty-lines": ["error", { "max": 1 }],
        "no-nested-ternary": "off",
        "no-plusplus": "off",
        "no-shadow": "off",
        "no-unused-vars": "off",
        "object-curly-newline": ["error", {
            "ObjectExpression": { "consistent": true, "minProperties": 5 }
        }]
    },
    "env": {
        "browser": true
    },
    "parserOptions": {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    }
}
