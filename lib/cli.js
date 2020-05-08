require("./utils/polyfill")
const { installDependency } = require("./packageJson/installDependency")
const { hasDependency } = require("./packageJson/hasDependency")
const { standartScripts } = require("./packageJson/standartScripts")
const { ExitMessage } = require("./utils/cliApp")
const { isHelpOption } = require("./utils/isHelpOption")
const { name } = require("../package.json")
const { initPackageJson } = require("./initPackageJson")
const { cleanupPackageJson } = require("./cleanupPackageJson")
const { makeScripts, scriptKeys } = require("./scripts")

const cli = async ([nodepath, selfpath, command, ...args]) => {
	const scripts = makeScripts({ nodepath, selfpath })
	const commands = makeCommands()

	if (isHelpOption(command)) {
		await commands.help(args)
	} else if (Object.keys(commands).includes(command)) {
		await commands[command](args)
	} else if (Object.keys(scripts).includes(command)) {
		await scripts[command](args)
	} else if (!standartScripts.includes(command)) {
		throw new ExitMessage(`Wrong command: ${command}`)
	}
}

const makeCommands = () => {
	const commands = {
		async init(args) {
			if (!args.includes("--no-install") && !(await hasDependency(name))) {
				await installDependency(name)
			}
			await initPackageJson(scriptKeys())
		},

		async uninstall() {
			await cleanupPackageJson()
		},

		async help() {
			console.log(
				`Available scripts are:\n\n  ${
					scriptKeys().join("\n  ")
					//
				}\n\nAvailable commands are:\n\n  ${
					Object.keys(commands).join("\n  ")
					//
				}\n`,
			)
		},
	}

	return commands
}

exports.cli = cli
