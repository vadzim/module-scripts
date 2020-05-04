#!/usr/bin/env node

const { spawn } = require("child_process")

spawn("npx", ["module-scripts", "init"], { stdio: "inherit" }).on("exit", code => process.exit(code))
