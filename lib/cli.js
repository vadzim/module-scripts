require("core-js")
const { installDependency } = require("./packageJson/installDependency")
const { hasDependency } = require("./packageJson/hasDependency")
const { ExitMessage } = require("./utils/cliApp")
const { name } = require("../package.json")
const { initPackageJson } = require("./initPackageJson")
const { cleanupPackageJson } = require("./cleanupPackageJson")
const { makeScripts } = require("./scripts")

const cli = async ([nodepath, selfpath, command, ...args]) => {
	const scripts = makeScripts({ nodepath, selfpath })
	const commands = makeCommands()

	if (Object.keys(commands).includes(command)) {
		await commands[command](args)
	} else if (Object.keys(scripts).includes(command)) {
		await scripts[command](args)
	} else {
		throw new ExitMessage(`Wrong command: ${command}`)
	}
}

const makeCommands = () => {
	const commands = {
		async init(args) {
			if (!args.includes("--no-install") && !(await hasDependency(name))) {
				await installDependency(name)
			}
			await initPackageJson()
		},

		async uninstall() {
			await cleanupPackageJson()
		},

		async help() {
			console.log(`available scripts are: ${Object.keys(makeScripts()).join(", ")}`)
			console.log(`command: ${Object.keys(commands).join(", ")}`)
		},

		"--help": async function () {
			await commands.help()
		},
	}

	return commands
}

module.exports = { cli }
