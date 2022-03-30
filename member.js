const express = require("express")
const memberRouter = express.Router()
const axios = require("axios")

// Given a member login id (on Github for now) as a request query, list all teams from Github that the member belongs to.
memberRouter.get("/team/list-all", async (req, res) => {
  const { apiKey, organization } = req
  const { login } = req.query

  // 1. List all teams from the organization
  // 2. For each team, list all members
})

module.exports = memberRouter
