#!/usr/bin/env node

const { cliApp } = require("../lib/cliApp")
const { changeHostPackage } = require("../lib/changeHostPackage")
const { cleanupPackageJson } = require("../lib/cleanupPackageJson")

cliApp(async () => {
	await changeHostPackage(cleanupPackageJson)
})
