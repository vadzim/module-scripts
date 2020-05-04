require("./utils/polyfill")
const { readPackage } = require("./packageJson/readPackage")
const { writePackage } = require("./packageJson/writePackage")
const { name } = require("../package.json")

const cleanupPackageJson = async () => {
	const pkg = await readPackage()

	const result = {
		...pkg,
		scripts:
			pkg.scripts && Object.fromEntries(Object.entries(pkg.scripts).filter(([, value]) => !isOwnScriptCall(value))),
	}

	await writePackage(result)
}

const isOwnScriptCall = command => {
	const tokens = command.split(/\s+/).filter(Boolean)
	return tokens.length === 2 && tokens[0] === name && /^(\w|:)+$/.test(tokens[1])
}

exports.cleanupPackageJson = cleanupPackageJson
