const util = require("util")
const path = require("path")
const rimraf = util.promisify(require("rimraf"))
const childProcess = require("child_process")
const { findFile } = require("./find-file")

const packageJson = findFile("package.json")
const root = packageJson.then(fn => path.dirname(fn || __filename))

const cli = async ([, , /* nodepath*/ /* selfpath*/ command /* ...args*/]) => {
	try {
		switch (command) {
			case "lint":
			case "lint:fix": {
				await spawn(
					findExecutable("eslint"),
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
				await rimraf(path.join(await root, "distr"))
				await compile("esnext")
				await compile("module")
				await compile("commonjs")
				break
			}
			case "test": {
				await spawn(
					findExecutable("jest"),
					[
						["--rootDir", await root],
						["--config", require.resolve("../jest.config.js")],
					].flat(),
				)
				break
			}
			case "coverage":
			case "prepublish":
			case "publish":
				console.log("unimplemented")
				break
			default:
				console.error("Unknown command:", command)
		}
	} catch (e) {
		if (e instanceof ExitCode) {
			process.exit(+e.message)
		}
		throw e
	}
}

const compile = async target => {
	console.log("target:", target)
	await spawn(
		findExecutable("babel"),
		[
			["--out-dir", path.join(await root, `distr/${target}`)],
			["--config-file", require.resolve("../babel.config.js")],
			["--ignore", "**/*.test.js"],
			path.join(await root, "src"),
		].flat(),
		{ env: { ...process.env, BABEL_ENV: target } },
	)
}

class ExitCode extends Error {}

const spawn = (command, args, options) =>
	new Promise((resolve, reject) =>
		childProcess
			.spawn(command, args, { stdio: "inherit", ...options })
			.on("error", reject)
			.on("exit", code => (code ? reject(new ExitCode(code)) : resolve())),
	)

const findExecutable = command => {
	try {
		return require.resolve(`.bin/${command}`, { paths: [process.cwd] })
	} catch (e) {
		if (e.code !== "MODULE_NOT_FOUND") throw e
	}
	return require.resolve(`.bin/${command}`)
}

module.exports = { cli }
