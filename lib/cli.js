const util = require("util")
const path = require("path")
const fs = require("fs").promises
const rimraf = util.promisify(require("rimraf"))
const childProcess = require("child_process")
const { findFile, dirs } = require("./find-file")
const { once } = require("./once")

const packageJsonFile = once(async () => findFile("package.json"))
const packageRoot = once(async () => path.dirname(await packageJsonFile()))
const packageJson = once(async () => JSON.parse(await fs.readFile(await packageJsonFile())))

const cli = async ([nodepath, selfpath, command /* ...args */]) => {
	switch (command) {
		case "lint":
		case "lint:fix": {
			await spawn(
				"eslint",
				[
					["--ignore-pattern", "/distr/*"],
					["--config", require.resolve("../.eslintrc.js")],
					["--resolve-plugins-relative-to", __dirname],
					"--cache",
					...(command === "lint:fix" ? ["--fix"] : []),
					// '--print-config',
					".",
				].flat(),
			)
			break
		}
		case "build": {
			await rimraf(path.join(await packageRoot(), "distr"))
			await compile("esnext")
			await compile("module")
			await compile("commonjs")
			break
		}
		case "test": {
			await spawn(
				"jest",
				[
					["--rootDir", await packageRoot()],
					["--config", require.resolve("../jest.config.js")],
				].flat(),
			)
			break
		}
		case "prepublish": {
			console.log('linting...')
			await cli([nodepath, selfpath, "lint"])
			break
		}
		case "coverage":
		case "publish":
			throw new ExitMessage(`Unimplemented: ${command}`)
		default:
			throw new ExitMessage(`Wrong command: ${command}`)
	}
}

const compile = async target => {
	console.log("target:", target)
	await spawn(
		"babel",
		[
			["--out-dir", path.join(await packageRoot(), `distr/${target}`)],
			["--config-file", require.resolve("../babel.config.js")],
			["--ignore", "**/*.test.js"],
			path.join(await packageRoot(), "src"),
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
						...new Set([...dirs(process.cwd()), ...dirs(__dirname)].map(dir => path.join(dir, "node_modules", ".bin"))),
						(options.env && options.env.PATH) || (process.env && process.env.PATH),
					].join(path.delimiter),
				},
			})
			.on("error", reject)
			.on("exit", code => (code ? reject(new ExitCode(code)) : resolve())),
	)

module.exports = { cli, ExitCode, ExitMessage }
