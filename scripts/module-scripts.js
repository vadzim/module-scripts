#!/usr/bin/env node

const { cli, ExitCode, ExitMessage } = require("../lib/cli")

cli(process.argv).catch(e => {
	if (e instanceof ExitCode) process.exit(+e.message)
	else if (e instanceof ExitMessage) {
		console.error(e.message)
		process.exit(1)
	} else throw e
})
