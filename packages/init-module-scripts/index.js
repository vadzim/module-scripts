const fs = require("fs").promises
const { packageJsonFile } = require("../../lib/packageJson/packageJsonFile")
const { installDependency } = require("../../lib/packageJson/installDependency")
const { spawn } = require("../../lib/utils/spawn")
const { cliApp } = require("../../lib/utils/cliApp")
const { name } = require("../../package.json")

cliApp(async argv => {
	if (argv[2] === "init" && argv.length === 3) {
		await installDependency(name)
		await spawn(await packageJsonFile(`node_modules/.bin/${name}`), ["init", "--no-install"])
		return
	}
	const executable = await packageJsonFile(`node_modules/.bin/${name}`)
	if (!fs.stat(executable).catch(() => false)) {
		console.log(`Run 'nmx init' to install ${name} in your project.`)
		return
	}
	await spawn(executable, argv.slice(2))
})
