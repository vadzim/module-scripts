const { installDependency } = require("../../lib/packageJson/installDependency")
const { initPackageJson } = require("../../lib/initPackageJson")
const scripts = require("./scripts.json")
const { name } = require("../../package.json")

const main = async () => {
	await installDependency(name)
	await initPackageJson(scripts)
}

main()
