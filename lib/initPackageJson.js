require("core-js")
const { readPackage } = require("./packageJson/readPackage")
const { writePackage } = require("./packageJson/writePackage")
const { name } = require("../package.json")
const { makeScripts } = require("./scripts")

const initPackageJson = async () => {
	const pkg = await readPackage()

	// some heuristics
	const source =
		pkg.source || (pkg.main || "index.js").replace(/^src\/|^source\/|^dist\/(commonjs\/)?(?=[^/]*$)/, "src/")

	const result = groupModuleEntries({
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

	await writePackage(result)
}

const groupModuleEntries = ({ module, esnext, source, ...pkg }) => {
	const entries = Object.entries(pkg)
	const index = entries.findIndex(([key]) => key === "main")
	entries.splice(index + 1, 0, ["module", module], ["esnext", esnext])
	entries.splice(index, 0, ["source", source])
	return Object.fromEntries(entries)
}

exports.initPackageJson = initPackageJson
