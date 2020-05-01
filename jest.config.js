const { defaults } = require("jest-config")
const babelConfig = require("./babel.config.js")

process.env.BABEL_ENV = "test"

module.exports = {
	...defaults,
	verbose: true,
	moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
	transform: {
		"\\.[jt]sx?$": [require.resolve("babel-jest"), babelConfig()],
	},
}
