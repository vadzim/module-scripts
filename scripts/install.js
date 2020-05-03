#!/usr/bin/env node

const path = require("path")
const { cliApp } = require("../lib/cliApp")
const { changeHostPackage } = require("../lib/changeHostPackage")
const { updatePackageJson } = require("../lib/updatePackageJson")
const { name } = require("../package.json")

cliApp(async () => {
	await changeHostPackage(async (packageJson, packageJsonFile) => {
		if (!(packageJson.dependencies || {})[name] && !(packageJson.devDependencies || {})[name]) {
			const shortName = path.join(path.basename(path.dirname(packageJsonFile)), path.basename(packageJsonFile))
			console.log(`Updating scripts in ${shortName}`)
			return await updatePackageJson(packageJson)
		}
		return undefined
	})
})
