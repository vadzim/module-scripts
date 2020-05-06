const { installDependency } = require("../../lib/packageJson/installDependency")
const { spawn } = require("../../lib/utils/spawn")
const { cliApp } = require("../../lib/utils/cliApp")
const { isHelpOption } = require("../../lib/utils/isHelpOption")
const { name } = require("../../package.json")

cliApp(async argv => {
	if (argv.find(isHelpOption)) {
		console.log("Run without arguments to install module-scripts in your project.")
		return
	}
	await installDependency(name)
	await spawn("module-scripts", ["init"])
})
