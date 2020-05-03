require("core-js")
const { name } = require("../package.json")

const cleanupPackageJson = packageJson => ({
	...packageJson,
	scripts:
		packageJson.scripts &&
		Object.fromEntries(Object.entries(packageJson.scripts).filter(([, value]) => !isOwnScriptCall(value))),
})

const isOwnScriptCall = command => {
	const tokens = command.split(/\s+/).filter(Boolean)
	return tokens.length === 2 && tokens[0] === name && /^(\w|:)+$/.test(tokens[1])
}

module.exports = { cleanupPackageJson }
