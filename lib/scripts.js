require("./utils/polyfill")
const util = require("util")
const fs = require("fs").promises
const rimraf = util.promisify(require("rimraf"))
const { findFile } = require("./utils/findFile")
const { binPaths } = require("./utils/binPaths")
const { spawn } = require("./utils/spawn")

const makeScripts = ({ nodepath } = {}) => {
	const scripts = {
		async compile() {
			await babel("esnext")
			await babel("module")
			await babel("commonjs")
		},

		async clean() {
			console.log("cleaning")
			await rimraf("./dist")
		},

		async types(args = undefined) {
			console.log("type checking")
			await spawn(
				"tsc",
				[
					"--allowJs",
					"--strict",
					"--noImplicitAny",
					"--noImplicitReturns",
					"--noImplicitThis",
					"--alwaysStrict",
					"--resolveJsonModule",
					"--skipLibCheck",
					"--emitDeclarationOnly",
					// incremental && ["--incremental", ["--tsBuildInfoFile", ".tsbuildinfo"]],
					["--jsx", "react"],
					"--declaration",
					["--declarationDir", "./dist/types"],
					["--lib", "dom,dom.iterable,esnext,webworker"],
					["--rootDir", "./src"],
					(await fs.readdir("src")).filter(f => !/\btest\b/.test(f)).map(f => `src/${f}`),
					args,
				]
					.flat(Infinity)
					.filter(Boolean),
			)
		},

		async build() {
			await spawn("npm", ["run-script", "--silent", "clean"])
			await spawn("npm", ["run-script", "--silent", "compile"])
			await spawn("npm", ["run-script", "--silent", "types"])
		},

		async lint(args = undefined) {
			console.log("linting")
			await spawn(
				"eslint",
				[
					["--ignore-pattern", "/dist/*"],
					["--ignore-pattern", "/node_modules/*"],
					["--ignore-pattern", "/coverage/*"],
					["--ignore-pattern", "/flow-typed/*"],
					["--config", require.resolve("../.eslintrc.js")],
					["--resolve-plugins-relative-to", __dirname],
					"--cache",
					".",
					args,
				]
					.flat(Infinity)
					.filter(Boolean),
			)
		},

		"lint:fix": async function (args = undefined) {
			await scripts.lint(["--fix", ...args])
		},

		"lint:ci": async function (args = undefined) {
			await scripts.lint(["--max-warnings=0", ...args])
		},

		async test(args = undefined, message = "running tests") {
			console.log(message)
			const jest = await findFile("jest", binPaths())
			process.argv = [
				nodepath,
				jest,
				["--rootDir", process.cwd()],
				["--config", require.resolve("../jest.config.js")],
				args,
			]
				.flat(Infinity)
				.filter(Boolean)
			module.require(jest)
		},

		"test:debug": async function (args = undefined) {
			const jest = await findFile("jest", binPaths())
			spawn(
				nodepath,
				[
					"--inspect",
					jest,
					"--runInBand",
					["--rootDir", process.cwd()],
					["--config", require.resolve("../jest.config.js")],
					args,
				]
					.flat(Infinity)
					.filter(Boolean),
			)
		},

		async coverage(args = undefined) {
			scripts.test(
				[
					"--coverage",
					["--collectCoverageFrom", "src/**/*.[jt]s"],
					["--collectCoverageFrom", "src/**/*.[jt]sx"],
					["--collectCoverageFrom", "src/**/*.[mc]js"],
					args,
				]
					.flat(Infinity)
					.filter(Boolean),
				"collecting coverage",
			)
		},

		async allchecks() {
			await spawn("npm", ["run-script", "--silent", "lint:ci"])
			await spawn("npm", ["run-script", "--silent", "build"])
			await spawn("npm", ["run-script", "--silent", "coverage"])
		},

		async prepack() {
			await spawn("npm", ["run-script", "--silent", "build"])
		},

		async prepublishOnly() {
			await spawn("npm", ["run-script", "--silent", "lint:ci"])
			await spawn("npm", ["run-script", "--silent", "test"])
		},

		async postpublish() {
			console.log("pushing")
			await spawn("git", ["push", "--follow-tags"])
		},
	}

	const babel = async target => {
		console.log("target:", target)
		await spawn(
			"babel",
			[
				["--out-dir", `./dist/${target}`],
				["--config-file", require.resolve("../babel.config.js")],
				["--ignore", "**/*.test.js"],
				["--ignore", "**/*.test.jsx"],
				["--ignore", "**/*.test.ts"],
				["--ignore", "**/*.d.ts"],
				["--ignore", "**/*.test.tsx"],
				["--ignore", "**/*.d.tsx"],
				["--extensions", ".js,.jsx,.mjs,.cjs,.ts,.tsx"],
				"./src",
			]
				.flat(Infinity)
				.filter(Boolean),
			{ env: { BABEL_ENV: target } },
		)
	}

	return scripts
}

const scriptKeys = () =>
	Object.entries(makeScripts())
		.filter(([, value]) => value)
		.map(([key]) => key)

exports.makeScripts = makeScripts
exports.scriptKeys = scriptKeys
