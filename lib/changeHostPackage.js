#!/usr/bin/env node

require("core-js")
const fs = require("fs").promises
const { findFiles } = require("./findFile")
const { elementAt } = require("./elementAt")

const changeHostPackage = async processor => {
	const packageJsonFile = await elementAt(findFiles("package.json", __dirname), 1)
	const packageJson = JSON.parse(await fs.readFile(packageJsonFile))
	const newPackageJson = await processor(packageJson, packageJsonFile)
	if (newPackageJson !== undefined) {
		await fs.writeFile(packageJsonFile, `${JSON.stringify(newPackageJson, undefined, "  ")}\n`)
	}
}

module.exports = { changeHostPackage }
