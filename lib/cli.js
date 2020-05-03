require("core-js")
const fs = require("fs").promises
const { name } = require("../package.json")
const { initPackageJson } = require("./initPackageJson")
const { cleanupPackageJson } = require("./cleanupPackageJson")
const { ExitMessage } = require("./cliApp")
const { makeScripts } = require("./scripts")
const { spawn } = require("./spawn")

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
			const pkg = JSON.parse(await fs.readFile("package.json"))
			if (!hasDependency(pkg, name) && !args.includes("--no-install")) {
				await installDependency(name)
			}
			await changeJsonFile("package.json", initPackageJson)
		},

		async uninstall() {
			await changeJsonFile("package.json", cleanupPackageJson)
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

const hasDependency = (pkg, dependency) =>
	(pkg.dependencies && pkg.dependencies[dependency]) || (pkg.devDependencies && pkg.devDependencies[dependency])

const installDependency = async dependency => {
	if (await fs.stat("yarn.lock").catch(() => false)) {
		await spawn("yarn", ["add", "--dev", dependency])
	} else {
		await spawn("npm", ["install", "--save-dev", dependency])
	}
}

const changeJsonFile = async processor => {
	const json = JSON.parse(await fs.readFile("package.json"))
	const result = await processor(json)
	if (result !== undefined) {
		await fs.writeFile("package.json", `${JSON.stringify(result, undefined, "  ")}\n`)
	}
}

module.exports = { cli }
