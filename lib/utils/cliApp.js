require("core-js")

class ExitCode extends Error {}
class ExitMessage extends Error {}

const cliApp = main =>
	new Promise(resolve => resolve(main(process.argv))).catch(e => {
		if (e instanceof ExitCode) {
			process.exit(+e.message)
		} else if (e instanceof ExitMessage) {
			console.error(e.message)
			process.exit(1)
		} else {
			throw e
		}
	})

exports.cliApp = cliApp
exports.ExitCode = ExitCode
exports.ExitMessage = ExitMessage
