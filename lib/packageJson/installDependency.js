const fs = require("fs").promises
const { spawn } = require("../utils/spawn")
const { packageJsonFile } = require("./packageJsonFile")

const installDependency = async dependency => {
	if (await fs.stat(await packageJsonFile("yarn.lock")).catch(() => false)) {
		await spawn("yarn", ["add", "--dev", dependency])
	} else {
		await spawn("npm", ["install", "--save-dev", dependency])
	}
}

exports.installDependency = installDependency
