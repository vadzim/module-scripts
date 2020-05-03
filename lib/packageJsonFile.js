const { findFile } = require("./findFile")
const { once } = require("./once")

const packageJsonFile = once(async () => findFile("package.json"))

module.exports = { packageJsonFile }
