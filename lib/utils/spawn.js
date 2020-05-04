require("core-js")
const path = require("path")
const childProcess = require("child_process")
const { binPaths } = require("./binPaths")
const { ExitCode } = require("./cliApp")

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

module.exports = { spawn }
