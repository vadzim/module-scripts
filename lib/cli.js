require("core-js")
const { changeHostPackage } = require("./changeHostPackage")
const { updatePackageJson } = require("./updatePackageJson")
const { cleanupPackageJson } = require("./cleanupPackageJson")
const { ExitMessage } = require("./cliApp")
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
		async update() {
			await changeHostPackage(updatePackageJson)
		},

		async cleanup() {
			await changeHostPackage(cleanupPackageJson)
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
