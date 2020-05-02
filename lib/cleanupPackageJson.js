require("core-js")

const cleanupPackageJson = packageJson => ({
	...packageJson,
	scripts:
		packageJson.scripts &&
		Object.fromEntries(
			Object.entries(packageJson.scripts).filter(([, value]) => !/^module-scripts (\w|:)+$/.test(value)),
		),
})

module.exports = { cleanupPackageJson }
