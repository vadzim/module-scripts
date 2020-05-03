#!/usr/bin/env node

require("core-js")
const fs = require("fs").promises
const { findFiles } = require("../lib/find-file")
const { elementAt } = require("../lib/elementAt")
const { cleanupPackageJson } = require("../lib/cleanupPackageJson")

const main = async () => {
	const packageJsonFile = await elementAt(findFiles("package.json", __dirname), 1)
	const packageJson = JSON.parse(await fs.readFile(packageJsonFile))

	await fs.writeFile(packageJsonFile, JSON.stringify(cleanupPackageJson(packageJson), undefined, "  "))
}

main()
