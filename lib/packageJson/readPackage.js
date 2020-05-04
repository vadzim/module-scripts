const fs = require("fs").promises

const readPackage = async () => JSON.parse(await fs.readFile("package.json"))

exports.readPackage = readPackage
