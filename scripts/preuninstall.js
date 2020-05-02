#!/usr/bin/env node

const fs = require("fs").promises
const path = require("path")
const { findFile } = require("../lib/find-file")

const main = async () => {
	const packageJsonFile = await findFile("package.json", path.dirname(process.cwd()))
	const packageJson = JSON.parse(await fs.readFile(packageJsonFile))

	if (packageJson.scripts)
		for (const [key, value] of Object.entries(packageJson.scripts))
			if (/^module-scripts (\w|:)+$/.test(value))
				delete packageJson.scripts[key]

	await fs.writeFile(packageJsonFile, JSON.stringify(packageJson, undefined, "  "))
}

main()
