const express = require("express")
const githubTeam = express.Router()
const { listAllTeamRepos, listAllTeamMembers } = require("./util")
const Admin = require("../database/admin")

// list all repositories for a github team
githubTeam.get("/list-repos", async (req, res) => {
  // 1. get Github's apiKey and organization from Deck's database
  const email = req.user["https://example.com/email"]
  let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err.message }))

  const { github } = admin
  if (!github || !github.apiKey || !github.organization)
    return res.status(404).json({ ok: false, message: "Error: Github credentials not found" })
  const { apiKey, organization } = github

  const { teamSlug } = req.query

  const repos = await listAllTeamRepos({ apiKey, organization, teamSlug }).catch((err) =>
    res.status(500).json({ ok: false, message: err.message })
  )

  return res.status(200).json({ ok: true, repos })
})

// given a team id, list all members for that github team
githubTeam.get("/list-members", async (req, res) => {
  const email = req.user["https://example.com/email"]
  let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err.message }))
  if (!github || !github.apiKey || !github.organization)
    return res.status(404).json({ ok: false, message: "Error: Github credentials not found" })
  const { apiKey, organization } = github

  const { teamId } = req.query
  if (!admin.team || !admin.team[teamId]) res.status(404).json({ ok: false, message: "No team found matches the team id" })

  const teamSlug = admin.team[teamId].slug

  const members = await listAllTeamMembers({ apiKey, organization, teamSlug }).catch((err) =>
    req.status(500).json({ ok: false, message: err.message })
  )

  return res.status(200).json({ ok: true, repos })
})

// list all teams under the organization
githubTeam.get("/list-all", async (req, res) => {})

// delete a team & remove all members from it
githubTeam.delete("/delete", async (req, res) => {})

// create a new team
githubTeam.post("/create", async (req, res) => {})

// remove members from a team
githubTeam.delete("/remove-members", async (req, res) => {})

// add members to a team
githubTeam.post("/add-members", async (req, res) => {})

module.exports = githubTeam
