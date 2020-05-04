const fs = require("fs").promises
const { spawn } = require("../utils/spawn")

const installDependency = async dependency => {
	if (await fs.stat("yarn.lock").catch(() => false)) {
		await spawn("yarn", ["add", "--dev", dependency])
	} else {
		await spawn("npm", ["install", "--save-dev", dependency])
	}
}

exports.installDependency = installDependency
