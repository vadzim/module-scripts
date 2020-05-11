const fs = require("fs").promises
const { installDependency } = require("../../lib/packageJson/installDependency")
const { spawn } = require("../../lib/utils/spawn")
const { cliApp } = require("../../lib/utils/cliApp")
const { name } = require("../../package.json")

cliApp(async argv => {
	if (argv[2] === "init" && argv.length === 3) {
		await installDependency(name)
		await spawn(`node_modules/.bin/${name}`, ["init", "--no-install"])
		return
	}
	if (!fs.stat(`node_modules/.bin/${name}`).catch(() => false)) {
		console.log(`Run \`nmx init\` to install ${name} in your project.`)
		return
	}
	await spawn(`node_modules/.bin/${name}`, argv.slice(2))
})
