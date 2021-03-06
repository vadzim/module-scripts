const path = require("path")
const fs = require("fs").promises
const { elementAt } = require("./elementAt")

const findFiles = async function* (file, from = process.cwd()) {
	for (const current of Array.isArray(from) ? from : dirs(from)) {
		const fullpath = path.join(current, file)
		if (await fs.stat(fullpath).catch(() => false)) yield fullpath
	}
}

function* dirs(dir) {
	for (
		let current = dir, next;
		current;
		next = path.dirname(current), current = !next || next === current ? null : next
	) {
		yield current
	}
}

const findFile = (...args) => elementAt(findFiles(...args), 0)

exports.findFile = findFile
exports.findFiles = findFiles
exports.dirs = dirs
