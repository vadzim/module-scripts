require("./utils/polyfill")
const { readPackage } = require("./packageJson/readPackage")
const { writePackage } = require("./packageJson/writePackage")
const { name } = require("../package.json")

const initPackageJson = async scripts => {
	const pkg = await readPackage()

	// some heuristics
	const source =
		pkg.source || (pkg.main || "index.js").replace(/^src\/|^source\/|^(dist\/(commonjs\/)?)?(?=[^/]*$)/, "src/")

	const result = groupModuleEntries({
		...pkg,
		scripts: {
			...Object.fromEntries(scripts.map(key => [key, `${name} ${key}`])),
			...pkg.scripts,
			test: pkg.scripts.test !== 'echo "Error: no test specified" && exit 1' ? test : `${name} test`,
		},
		source,
		types: source.replace(/^(src\/)?/, "dist/types/").replace(/\.\w+$/, ".d.ts"),
		main: source.replace(/^(src\/)?/, "dist/commonjs/"),
		module: source.replace(/^(src\/)?/, "dist/module/"),
		esnext: source.replace(/^(src\/)?/, "dist/esnext/"),
	})

	await writePackage(result)
}

const groupModuleEntries = ({ module, esnext, source, types, ...pkg }) => {
	const entries = Object.entries(pkg)
	const index = entries.findIndex(([key]) => key === "main")
	entries.splice(index + 1, 0, ["module", module], ["esnext", esnext])
	entries.splice(index, 0, ["source", source], ["types", types])
	return Object.fromEntries(entries)
}

exports.initPackageJson = initPackageJson
