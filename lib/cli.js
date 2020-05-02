const util = require("util")
const path = require("path")
// const fs = require("fs").promises
const rimraf = util.promisify(require("rimraf"))
const childProcess = require("child_process")
const { findFile, dirs } = require("./find-file")
const { once } = require("./once")

const packageJsonFile = once(async () => findFile("package.json"))
const packageRoot = once(async () => path.dirname(await packageJsonFile()))
// const packageJson = once(async () => JSON.parse(await fs.readFile(await packageJsonFile())))

const cli = async ([nodepath, selfpath, command, ...args]) => {
	if (["help", "--help"].includes(command)) {
		console.log(`available scripts are: ${Object.keys(scripts).join(", ")}`)
	} else if (Object.keys(scripts).includes(command)) {
		await scripts[command](args, nodepath, selfpath)
	} else {
		throw new ExitMessage(`Wrong command: ${command}`)
	}
}

const scripts = {
	async build(args) {
		await rimraf(path.join(await packageRoot(), "distr"))
		await compile("esnext", args)
		await compile("module", args)
		await compile("commonjs", args)
	},

	async lint(args) {
		await spawn(
			"eslint",
			[
				["--ignore-pattern", "/distr/*"],
				["--config", require.resolve("../.eslintrc.js")],
				["--resolve-plugins-relative-to", __dirname],
				"--cache",
				".",
				...args,
			].flat(),
		)
	},

	"lint:fix": async function (args) {
		await scripts.lint(["--fix", ...args])
	},

	"lint:ci": async function (args) {
		await scripts.lint(["--max-warnings=0", ...args])
	},

	async test(args, nodepath) {
		const jest = await findFile("jest", binPaths())
		process.argv = [
			nodepath,
			jest,
			["--rootDir", await packageRoot()],
			["--config", require.resolve("../jest.config.js")],
			...args,
		].flat()
		module.require(jest)
	},

	"test:debug": async function (args, nodepath) {
		const jest = await findFile("jest", binPaths())
		spawn(
			nodepath,
			[
				"--inspect",
				jest,
				"--runInBand",
				["--rootDir", await packageRoot()],
				["--config", require.resolve("../jest.config.js")],
				...args,
			].flat(),
		)
	},

	async coverage() {
		throw new ExitMessage("Unimplemented: coverage")
	},

	async prepare() {
		console.log("building...")
		await scripts.build([])
	},

	async prepublishOnly() {
		console.log("linting...")
		await scripts["lint:ci"]([])
		console.log("building...")
		await scripts.build([])
		console.log("testing...")
		await scripts.test([])
	},
}

const compile = async (target, args) => {
	console.log("target:", target)
	await spawn(
		"babel",
		[
			["--out-dir", path.join(await packageRoot(), `distr/${target}`)],
			["--config-file", require.resolve("../babel.config.js")],
			["--ignore", "**/*.test.js"],
			path.join(await packageRoot(), "src"),
			...args,
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
