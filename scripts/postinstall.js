#!/usr/bin/env node

require("core-js")
const { onHostPackage } = require("../lib/onHostPackage")
const { updatePackageJson } = require("../lib/updatePackageJson")

const main = () => onHostPackage(updatePackageJson)

main()
