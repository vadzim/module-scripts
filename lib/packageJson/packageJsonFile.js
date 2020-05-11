const path = require("path")
const { findFile } = require("../utils/findFile")

const packageJsonFile = (fn = "package.json") =>
	findFile("package.json").then(
		packageJson => path.join(path.dirname(packageJson), fn),
		() => path.join(process.cwd(), fn),
	)

exports.packageJsonFile = packageJsonFile
