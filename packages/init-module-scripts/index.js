const { installDependency } = require("../../lib/packageJson/installDependency")
const { spawn } = require("../../lib/utils/spawn")
const { cliApp } = require("../../lib/utils/cliApp")
const { name } = require("../../package.json")

cliApp(async argv => {
	if (argv[0] === "init" && argv.length === 1) {
		await installDependency(name)
		await spawn(name, ["init"])
		return
	}
	console.log("Run `nmx init` to install module-scripts in your project.")
})
