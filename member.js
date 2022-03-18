const express = require("express")
const memberRouter = express.Router()

// list all members under the organization
memberRouter.get("/list-all", async (req, res) => {})

module.exports = memberRouter
