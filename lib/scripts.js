require("core-js")
const util = require("util")
const fs = require("fs").promises
const rimraf = util.promisify(require("rimraf"))
const { findFile } = require("./findFile")
const { binPaths } = require("./binPaths")
const { spawn } = require("./spawn")

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

		async types() {
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
					"--incremental",
					["--tsBuildInfoFile", ".tscache"],
					["--jsx", "react"],
					"--declaration",
					["--declarationDir", "./dist/types"],
					["--lib", "dom,dom.iterable,esnext,webworker"],
					["--rootDir", "./src"],
					(await fs.readdir("src")).map(f => `src/${f}`),
				].flat(),
			)
		},

		async build() {
			await spawn("npm", ["run-script", "--silent", "lint:ci"])
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
					...(args || []),
				].flat(),
			)
		},

		"lint:fix": async function (args = undefined) {
			await scripts.lint(["--fix", ...args])
		},

		"lint:ci": async function (args = undefined) {
			await scripts.lint(["--max-warnings=0", ...args])
		},

		async test(args = [], message = "running tests") {
			console.log(message)
			const jest = await findFile("jest", binPaths())
			process.argv = [
				nodepath,
				jest,
				["--rootDir", process.cwd()],
				["--config", require.resolve("../jest.config.js")],
				...args,
			].flat()
			module.require(jest)
		},

		"test:debug": async function (args = []) {
			const jest = await findFile("jest", binPaths())
			spawn(
				nodepath,
				[
					"--inspect",
					jest,
					"--runInBand",
					["--rootDir", process.cwd()],
					["--config", require.resolve("../jest.config.js")],
					...args,
				].flat(),
			)
		},

		async coverage(args = []) {
			scripts.test(
				[
					"--coverage",
					["--collectCoverageFrom", "src/**/*.[jt]s"],
					["--collectCoverageFrom", "src/**/*.[jt]sx"],
					["--collectCoverageFrom", "src/**/*.[mc]js"],
					...args,
					//
				].flat(),
				"collecting coverage",
			)
		},

		async prepack() {
			await spawn("npm", ["run-script", "--silent", "build"])
		},

		async preversion() {
			await spawn("npm", ["run-script", "--silent", "lint:ci"])
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
				["--ignore", "**/*.test.tsx"],
				["--extensions", ".js,.jsx,.mjs,.cjs,.ts,.tsx"],
				"./src",
			].flat(),
			{ env: { BABEL_ENV: target } },
		)
	}

	return scripts
}

module.exports = { makeScripts }
