require("core-js")
const { makeScripts } = require("./scripts")
const { name } = require("../package.json")

const initPackageJson = pkg => {
	// some heuristics
	const source =
		pkg.source || (pkg.main || "index.js").replace(/^src\/|^source\/|^dist\/(commonjs\/)?(?=[^/]*$)/, "src/")
	return groupModuleEntries({
		...pkg,
		scripts: {
			...Object.fromEntries(Object.keys(makeScripts()).map(key => [key, `${name} ${key}`])),
			...pkg.scripts,
		},
		source,
		main: source.replace(/^(src\/)?/, "dist/commonjs/"),
		module: source.replace(/^(src\/)?/, "dist/module/"),
		esnext: source.replace(/^(src\/)?/, "dist/esnext/"),
	})
}

const groupModuleEntries = ({ module, esnext, source, ...pkg }) => {
	const entries = Object.entries(pkg)
	const index = entries.findIndex(([key]) => key === "main")
	entries.splice(index + 1, 0, ["module", module], ["esnext", esnext])
	entries.splice(index, 0, ["source", source])
	return Object.fromEntries(entries)
}

module.exports = { initPackageJson }
