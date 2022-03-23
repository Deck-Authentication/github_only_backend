const express = require("express")
const githubRouter = express.Router()
const githubTeamRouter = require("./team")
const Admin = require("../database/admin")
const { listAllTeams } = require("./util")

// save a Github credentials &  to Deck's database
// the key is a personal access token from a Github user: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
githubRouter.post("/save-credentials", async (req, res) => {
  const { apiKey, organization } = req.body
  const email = req.user["https://example.com/email"]

  if (!apiKey || !organization) {
    res.status(400).json({ ok: false, message: "Error: apiKey and organization must be provided as non-empty strings" })
    return
  }

  await Admin.findOneAndUpdate({ email }, { github: { apiKey, organization } })
    .exec()
    .catch((err) => res.status(500).json({ ok: false, message: err }))

  res.status(200).json({ ok: true, message: "Successfully saved Github credentials" })
})

// import all users and teams data from github, then save to Deck's database
githubRouter.put("/import-all", async (req, res) => {
  // 1. get Github's apiKey and organization from Deck's database
  const email = req.user["https://example.com/email"]
  const github = await Admin.findOne({ email }, "github").catch((err) => res.status(500).json({ ok: false, message: err }))

  if (!github || !github.apiKey || !github.organization)
    return res.status(404).json({ ok: false, message: "Error: Github credentials not found" })
  const { apiKey, organization } = github

  // 2. get all teams from github
  // 2.1. fetch all members of each team from github
  const teams = await listAllTeams({ apiKey, organization }).catch((err) => res.status(500).json({ ok: false, message: err }))
  // 2.2. fetch all repositories of each team from github

  // 3. get all users from github
  // 4. save all teams to Deck's database
  // 5. save all users to Deck's database
})

githubRouter.use("/team", githubTeamRouter)

module.exports = githubRouter
