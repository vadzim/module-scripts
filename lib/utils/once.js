const once = fn => {
	let proxy = () => {
		try {
			const result = fn()
			proxy = () => result
			return result
		} catch (e) {
			proxy = () => {
				throw e
			}
			throw e
		}
	}
	return () => proxy()
}

module.exports = { once }
