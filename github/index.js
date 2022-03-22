const express = require("express")
const githubRouter = express.Router()
const githubTeamRouter = require("./team")
const Admin = require("../database/admin")

// save a Github credentials &  to Deck's database
// the key is a personal access token from a Github user: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
githubRouter.post("/save-credentials", async (req, res) => {
  const { apiKey, organization } = req.body
  const email = req.user["https://example.com/email"]

  if (!apiKey || !organization) {
    res.status(400).json({ ok: false, message: "Error: apiKey and organization must be provided as non-empty strings" })
    return
  }

  await Admin.findOneAndUpdate({ email }, { github: { apiKey, organization } }).catch((err) =>
    res.status(500).json({ ok: false, message: err })
  )

  res.status(200).json({ ok: true, message: "Successfully saved Github credentials" })
})

githubRouter.use("/team", githubTeamRouter)

module.exports = githubRouter
