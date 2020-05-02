/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

let reactVersion = "999.999.999"

try {
	reactVersion = require(require.resolve("react/package.json", { paths: [process.cwd()] })).version
	// eslint-disable-next-line no-empty
} catch {}

module.exports = {
	settings: {
		"import/resolver": {
			node: {
				paths: ["src", "node_modules"],
				extensions: [".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx"],
			},
		},
		react: {
			version: reactVersion,
		},
	},
	ignorePatterns: ["!.eslintrc.*", "/node_modules/", "/distr/"],
	env: {
		browser: true,
		jest: true,
	},
	parser: "babel-eslint",
	...settings(),
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			parser: "@typescript-eslint/parser",
			...settings(),
		},
	],
}

function settings() {
	return {
		plugins: ["babel", "@typescript-eslint"],
		extends: [
			"airbnb-base",
			"react-app",
			"plugin:prettier/recommended",
			"prettier/react",
			"prettier/standard",
			"plugin:@typescript-eslint/recommended",
			"prettier/@typescript-eslint",
		],
		rules: {
			"prettier/prettier": [
				"warn",
				{
					usePrettierrc: false,
					printWidth: 120,
					tabWidth: 2,
					useTabs: true,
					semi: false,
					singleQuote: false,
					trailingComma: "all",
					endOfLine: "lf",
					arrowParens: "avoid",
				},
			],

			"react-hooks/exhaustive-deps": [
				"warn",
				{
					additionalHooks: "^(useMemoOne|useCallbackOne|useDebouncedEffect)$",
				},
			],

			// duplicate quote setting here 'cause eslint also converts useless backticks to quotes
			// while prettier doesn't
			quotes: ["warn", "double", { avoidEscape: true }],

			"no-restricted-syntax": ["error", "WithStatement", "LabeledStatement", "ForInStatement"],

			"no-param-reassign": ["error", { props: false }],
			"no-underscore-dangle": "warn",

			// TODO: TBD: does we need these settings?
			camelcase: "off",
			"no-console": "off",

			// turn off some plugins' defaults
			"no-mixed-operators": "off",
			"import/prefer-default-export": "off",
			"import/no-default-export": "error",
			"import/extensions": "off",
			"import/no-extraneous-dependencies": "off",

			"no-debugger": "warn",
			"no-await-in-loop": "off",
			"no-alert": "off",
			"no-plusplus": "off",
			"class-methods-use-this": "off",
			"no-loop-func": "off",
			"no-nested-ternary": "off",
			"no-bitwise": "off",
			"no-return-await": "off",
			"no-void": "off",
			"react/no-multi-comp": "off",
			"react/destructuring-assignment": "off",
			"react/jsx-filename-extension": "off",
			"react/jsx-one-expression-per-line": "off",
			"react/jsx-props-no-spreading": "off",
			"react/jsx-curly-newline": "off",
			"spaced-comment": ["warn", "always", { markers: ["/"] }],
			"prefer-arrow-callback": ["warn", { allowNamedFunctions: true }],
			"max-classes-per-file": "off",
			"arrow-body-style": ["warn", "as-needed", { requireReturnForObjectLiteral: false }],
			"no-unused-vars": "off", // @typescript-eslint/no-unused-vars is enough
			"prefer-template": "warn",
			"import/order": "warn",
			"no-useless-constructor": "off",
			"no-unused-expressions": "off",
			"no-use-before-define": "off",
			"require-yield": "off",
			"func-names": "off",
			"@typescript-eslint/no-use-before-define": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-var-requires": "off",

			// Eslint still does not support optional chaining. https://github.com/eslint/eslint/issues/12822
			// This is workaround.
			"babel/no-unused-expressions": ["warn", { allowShortCircuit: true, allowTernary: true }],
		},
	}
}
