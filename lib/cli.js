const util = require("util")
const path = require("path")
const rimraf = util.promisify(require("rimraf"))
const childProcess = require("child_process")
const { findFile, dirs } = require("./find-file")

const packageJson = findFile("package.json")
const root = packageJson.then(fn => path.dirname(fn || __filename))

const cli = async ([, , /* nodepath*/ /* selfpath*/ command /* ...args*/]) => {
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
			await rimraf(path.join(await root, "distr"))
			await compile("esnext")
			await compile("module")
			await compile("commonjs")
			break
		}
		case "test": {
			await spawn(
				"jest",
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
		default: {
			console.error("Unknown command:", command)
			throw new ExitCode(1)
		}
	}
}

const compile = async target => {
	console.log("target:", target)
	await spawn(
		"babel",
		[
			["--out-dir", path.join(await root, `distr/${target}`)],
			["--config-file", require.resolve("../babel.config.js")],
			["--ignore", "**/*.test.js"],
			path.join(await root, "src"),
		].flat(),
		{ env: { BABEL_ENV: target } },
	)
}

class ExitCode extends Error {}

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

module.exports = { cli, ExitCode }
