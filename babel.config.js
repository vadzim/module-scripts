module.exports = api => {
	const { BABEL_ENV = "commonjs" } = process.env

	if (api) api.cache.using(() => BABEL_ENV)

	return {
		commonjs: {
			presets: [
				[require.resolve("@babel/preset-env"), { targets: { node: 10 } }],
				require.resolve("@babel/preset-react"),
				require.resolve("@babel/preset-typescript"),
			],
			plugins: [
				[require.resolve("@babel/plugin-transform-modules-commonjs"), { loose: true }],
				require.resolve("@babel/plugin-transform-strict-mode"),
				require.resolve("babel-plugin-add-module-exports"),
			],
		},
		module: {
			presets: [
				[require.resolve("@babel/preset-env"), { modules: false, shippedProposals: true, targets: { node: 14 } }],
				require.resolve("@babel/preset-react"),
				require.resolve("@babel/preset-typescript"),
			],
			plugins: [],
		},
		esnext: {
			presets: [
				[require.resolve("@babel/preset-env"), { modules: false, shippedProposals: true, targets: { safari: "tp" } }],
				require.resolve("@babel/preset-react"),
				require.resolve("@babel/preset-typescript"),
			],
			plugins: [],
		},
		test: {
			presets: [
				[require.resolve("@babel/preset-env"), { targets: { node: 12 } }],
				require.resolve("@babel/preset-react"),
				require.resolve("@babel/preset-typescript"),
			],
			plugins: [],
		},
	}[BABEL_ENV]
}
