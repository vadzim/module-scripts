const path = require("path")
const fs = require("fs").promises

const findFiles = async function* (file, from = process.cwd()) {
	for (
		let current = from, next;
		current;
		next = path.dirname(current), current = !next || next === current ? null : next
	) {
		const fullpath = path.join(current, file)
		if (await fs.stat(fullpath).catch(() => false)) yield fullpath
	}
}

const findFile = async (...args) => {
	for await (const result of findFiles(...args)) {
		return result
	}
	return null
}

module.exports = { findFile, findFiles }
