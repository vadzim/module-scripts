#!/usr/bin/env node

require("core-js")
const { onHostPackage } = require("../lib/onHostPackage")
const { cleanupPackageJson } = require("../lib/cleanupPackageJson")

const main = () => onHostPackage(cleanupPackageJson)

main()
