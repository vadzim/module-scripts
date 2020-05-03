require("core-js")
const path = require("path")
const { dirs } = require("./findFile")
const { once } = require("./once")

const binPaths = once(() => {
	const currentPaths = [...dirs(process.cwd())]
	const selfPaths = [...dirs(__dirname)]
	const commonPaths = []
	while (
		currentPaths.length &&
		selfPaths.length &&
		currentPaths[currentPaths.length - 1] === selfPaths[selfPaths.length - 1]
	) {
		commonPaths.unshift(currentPaths.pop())
		selfPaths.pop()
	}
	return [...currentPaths, ...selfPaths, ...commonPaths].map(p => path.join(p, "node_modules", ".bin"))
})

module.exports = { binPaths }
