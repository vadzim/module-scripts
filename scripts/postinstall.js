#!/usr/bin/env node

const fs = require("fs").promises
const path = require("path")
const { findFile } = require("../lib/find-file")
const { scripts } = require("../lib/cli")

const main = async () => {
	const packageJsonFile = await findFile("package.json", path.dirname(process.cwd()))
	const packageJson = JSON.parse(await fs.readFile(packageJsonFile))

	const newPackageJson = {
		...packageJson,
		scripts: {
			...Object.fromEntries(Object.keys(scripts).map(key => [key, `module-scripts ${key}`])),
			...packageJson.scripts,
		},
	}

	await fs.writeFile(packageJsonFile, JSON.stringify(newPackageJson, undefined, "  "))
}

main()
