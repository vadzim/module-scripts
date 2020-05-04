import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import node from "@rollup/plugin-node-resolve"

const fs = require("fs").promises
const path = require("path")
const { scriptKeys } = require("../../lib/scripts")

// eslint-disable-next-line import/no-default-export
export default (async () => {
	await fs.writeFile(`${__dirname}/scripts.json`, JSON.stringify(scriptKeys()))
	return {
		input: "index.js",
		output: {
			file: "init-module-scripts.js",
			format: "cjs",
		},
		plugins: [commonjs(), json(), node({ customResolveOptions: { rootDir: path.dirname(path.dirname(__dirname)) } })],
	}
})()
