import path from "path"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import node from "@rollup/plugin-node-resolve"

// eslint-disable-next-line import/no-default-export
export default {
	input: "index.js",
	output: {
		file: "init-module-scripts.js",
		format: "cjs",
	},
	plugins: [commonjs(), json(), node({ customResolveOptions: { rootDir: path.dirname(path.dirname(__dirname)) } })],
}
