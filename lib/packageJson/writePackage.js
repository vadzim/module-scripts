const fs = require("fs").promises

const writePackage = async pkg => await fs.writeFile("package.json", `${JSON.stringify(pkg, undefined, "  ")}\n`)

module.exports = { writePackage }
