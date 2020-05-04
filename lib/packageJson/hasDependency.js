const { readPackage } = require("./readPackage")

const hasDependency = async dependency => {
	const pkg = await readPackage()

	return (pkg.dependencies && pkg.dependencies[dependency]) || (pkg.devDependencies && pkg.devDependencies[dependency])
}

module.exports = { hasDependency }
