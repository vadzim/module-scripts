const at = async (items, index) => {
	let left = index
	for await (const item of items) {
		if (left < 1) return item
		left--
	}
	throw new RangeError("index out of bounds")
}

module.exports = { at }
