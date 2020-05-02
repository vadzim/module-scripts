require("core-js")
const util = require("util")
const path = require("path")
const rimraf = util.promisify(require("rimraf"))
const childProcess = require("child_process")
const { findFile, dirs } = require("./find-file")
const { once } = require("./once")

const packageJsonFile = once(async () => findFile("package.json"))
const packageRoot = once(async () => path.dirname(await packageJsonFile()))

const context = { nodepath: "", selfpath: "" }

const cli = async ([nodepath, selfpath, command, ...args]) => {
	Object.assign(context, { nodepath, selfpath })
	if (["help", "--help"].includes(command)) {
		console.log(`available scripts are: ${Object.keys(scripts).join(", ")}`)
	} else if (Object.keys(scripts).includes(command)) {
		await scripts[command](args)
	} else {
		throw new ExitMessage(`Wrong command: ${command}`)
	}
}

const scripts = {
	async build(args = undefined) {
		await rimraf(path.join(await packageRoot(), "dist"))
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
			context.nodepath,
			jest,
			["--rootDir", await packageRoot()],
			["--config", require.resolve("../jest.config.js")],
			...(args || []),
		].flat()
		module.require(jest)
	},

	"test:debug": async function (args = undefined) {
		const jest = await findFile("jest", binPaths())
		spawn(
			context.nodepath,
			[
				"--inspect",
				jest,
				"--runInBand",
				["--rootDir", await packageRoot()],
				["--config", require.resolve("../jest.config.js")],
				...(args || []),
			].flat(),
		)
	},

	async coverage() {
		throw new ExitMessage("Unimplemented: coverage")
	},

	async prepare() {
		await spawn("npm", ["run", "--silent", "build"])
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
			["--out-dir", path.join(await packageRoot(), `dist/${target}`)],
			["--config-file", require.resolve("../babel.config.js")],
			["--ignore", "**/*.test.js"],
			path.join(await packageRoot(), "src"),
			...(args || []),
		].flat(),
		{ env: { BABEL_ENV: target } },
	)
}

class ExitCode extends Error {}
class ExitMessage extends Error {}

const spawn = (command, args, options = {}) =>
	new Promise((resolve, reject) =>
		childProcess
			.spawn(command, args, {
				stdio: "inherit",
				...options,
				env: {
					...process.env,
					...options.env,
					PATH: [
						...binPaths(),
						(options.env && options.env.PATH) || (process.env && process.env.PATH),
						//
					].join(path.delimiter),
				},
			})
			.on("error", reject)
			.on("exit", code => (code ? reject(new ExitCode(code)) : resolve())),
	)

const binPaths = once(() => {
	const currentPaths = [...dirs(process.cwd())]
	const selfPaths = [...dirs(__dirname)]
	const commonPaths = []
	while (
		currentPaths.length &&
		selfPaths.length &&
		currentPaths[currentPaths.length - 1] === selfPaths[selfPaths.length - 1]
	) {
		commonPaths.unshift(currentPaths.pop())
		selfPaths.pop()
	}
	return [...currentPaths, ...selfPaths, ...commonPaths].map(p => path.join(p, "node_modules", ".bin"))
})

module.exports = { cli, scripts, ExitCode, ExitMessage }
