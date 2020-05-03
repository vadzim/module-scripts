require("core-js")
const util = require("util")
const path = require("path")
const rimraf = util.promisify(require("rimraf"))
const { findFile } = require("./findFile")
const { binPaths } = require("./binPaths")
const { packageJsonFile } = require("./packageJsonFile")
const { ExitMessage } = require("./cliApp")
const { spawn } = require("./spawn")

const makeScripts = ({ nodepath } = {}) => {
	const scripts = {
		async build(args = undefined) {
			await rimraf(path.join(path.dirname(await packageJsonFile()), "dist"))
			await compile("esnext", args)
			await compile("module", args)
			await compile("commonjs", args)
		},

		async lint(args = undefined) {
			await spawn(
				"eslint",
				[
					["--ignore-pattern", "/dist/*"],
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

		async test(args = undefined) {
			const jest = await findFile("jest", binPaths())
			process.argv = [
				nodepath,
				jest,
				["--rootDir", path.dirname(await packageJsonFile())],
				["--config", require.resolve("../jest.config.js")],
				...(args || []),
			].flat()
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
					["--rootDir", path.dirname(await packageJsonFile())],
					["--config", require.resolve("../jest.config.js")],
					...(args || []),
				].flat(),
			)
		},

		async coverage() {
			throw new ExitMessage("Unimplemented: coverage")
		},

		async prepack() {
			await spawn("npm", ["run", "--silent", "build"])
		},

		async preversion() {
			await spawn("npm", ["run", "--silent", "lint:ci"])
		},

		async prepublishOnly() {
			console.log("linting...")
			await spawn("npm", ["run", "--silent", "lint:ci"])
			console.log("testing...")
			await spawn("npm", ["run", "--silent", "test"])
		},
	}

	const compile = async (target, args) => {
		console.log("target:", target)
		await spawn(
			"babel",
			[
				["--out-dir", path.join(path.dirname(await packageJsonFile()), `dist/${target}`)],
				["--config-file", require.resolve("../babel.config.js")],
				["--ignore", "**/*.test.js"],
				["--ignore", "**/*.test.jsx"],
				["--ignore", "**/*.test.ts"],
				["--ignore", "**/*.test.tsx"],
				path.join(path.dirname(await packageJsonFile()), "src"),
				...(args || []),
			].flat(),
			{ env: { BABEL_ENV: target } },
		)
	}

	return scripts
}

module.exports = { makeScripts }
