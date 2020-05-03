require("core-js")
const { makeScripts } = require("./scripts")
const { name } = require("../package.json")

const initPackageJson = packageJson =>
	groupModuleEntries({
		...packageJson,
		scripts: {
			...Object.fromEntries(Object.keys(makeScripts()).map(key => [key, `${name} ${key}`])),
			...packageJson.scripts,
		},
		main: makeModuleEntry(packageJson, "main", "commonjs"),
		module: makeModuleEntry(packageJson, "module"),
		esnext: makeModuleEntry(packageJson, "esnext"),
	})

const makeModuleEntry = (packageJson, entryName, target = entryName) => {
	// some heuristics
	const oldEntry = packageJson[entryName] || packageJson.main || "index.js"
	if (!/\//.test(oldEntry)) return `dist/${target}/${oldEntry}`
	return oldEntry.replace(/^src\/|^source\/|^dist\/(commonjs\/)?(?=[^/]*$)/, `dist/${target}/`)
}

const groupModuleEntries = ({ module, esnext, ...packageJson }) => {
	const entries = Object.entries(packageJson)
	entries.splice(entries.findIndex(([key]) => key === "main") + 1, 0, ["module", module], ["esnext", esnext])
	return Object.fromEntries(entries)
}

module.exports = { initPackageJson }
