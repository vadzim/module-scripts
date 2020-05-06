const { installDependency } = require("../../lib/packageJson/installDependency")
const { initPackageJson } = require("../../lib/initPackageJson")
const { cliApp } = require("../../lib/utils/cliApp")
const scripts = require("./scripts.json")
const { isHelpOption } = require("../../lib/utils/isHelpOption")
const { name } = require("../../package.json")

cliApp(async argv => {
	if (argv.find(isHelpOption)) {
		console.log("Run without arguments to install module-scripts in your project.")
		return
	}
	await installDependency(name)
	await initPackageJson(scripts)
})
