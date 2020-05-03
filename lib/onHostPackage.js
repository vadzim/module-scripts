#!/usr/bin/env node

require("core-js")
const fs = require("fs").promises
const { findFiles } = require("./find-file")
const { elementAt } = require("./elementAt")

const onHostPackage = async processor => {
	const packageJsonFile = await elementAt(findFiles("package.json", __dirname), 1)
	const packageJson = JSON.parse(await fs.readFile(packageJsonFile))

	await fs.writeFile(packageJsonFile, JSON.stringify(processor(packageJson), undefined, "  "))
}

module.exports = { onHostPackage }
