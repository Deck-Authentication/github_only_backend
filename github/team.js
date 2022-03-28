const express = require("express")
const githubTeam = express.Router()
const { listAllTeamRepos, listAllTeamMembers, createTeam } = require("./util")
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

// given a team slug, list all members for that github team
// prerequisite: teh teamSlug must belong to a team from Deck's database
githubTeam.get("/list-members", async (req, res) => {
  const email = req.user["https://example.com/email"]
  let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err.message }))
  const { github } = admin
  if (!github || !github.apiKey || !github.organization)
    return res.status(404).json({ ok: false, message: "Error: Github credentials not found" })
  const { apiKey, organization } = github

  const { teamSlug } = req.query
  if (!admin.teams) return res.status(404).json({ ok: false, message: "No team found" })

  let listMemberError
  const members = await listAllTeamMembers({ apiKey, organization, teamSlug }).catch((error) => {
    console.error(error)
    listMemberError = error
  })

  return listMemberError
    ? res.status(500).json({ ok: false, error: listMemberError })
    : res.status(200).json({ ok: true, members })
})

// delete a team & remove all members from it
githubTeam.delete("/delete", async (req, res) => {})

// create a new team
githubTeam.post("/create", async (req, res) => {
  const email = req.user["https://example.com/email"]
  let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err.message }))
  const { github } = admin
  if (!github || !github.apiKey || !github.organization)
    return res.status(404).json({ ok: false, message: "Error: Github credentials not found" })
  const { apiKey, organization } = github

  // team name can contain whitespaces
  const { team } = req.body
  let createTeamError
  const newTeam = await createTeam({ apiKey, organization, teamName: team }).catch((error) => {
    console.error(error)
    createTeamError = error
  })

  return createTeamError
    ? res.status(500).json({ ok: false, error: createTeamError })
    : res.status(200).json({ ok: true, newTeam })
})

// remove members from a team
githubTeam.delete("/remove-members", async (req, res) => {})

// add members to a team
githubTeam.post("/add-members", async (req, res) => {})

module.exports = githubTeam
