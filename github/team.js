const express = require("express")
const githubTeam = express.Router()
const {
  listAllTeamRepos,
  listAllTeamMembers,
  createTeam,
  listAllTeams,
  deleteTeam,
  inviteMemberToTeam,
  removeMemberFromTeam,
} = require("./util")
const Admin = require("../database/admin")

// list all teams for a github organization
githubTeam.get("/list-all", async (req, res) => {
  const { apiKey, organization } = req
  const teams = await listAllTeams({ apiKey, organization }).catch((err) =>
    res.status(500).json({ ok: false, message: err.message })
  )

  return res.status(200).json({ ok: true, teams })
})

// list all repositories for a github team
githubTeam.get("/list-repos", async (req, res) => {
  const { apiKey, organization } = req

  const { teamSlug } = req.query

  const repos = await listAllTeamRepos({ apiKey, organization, teamSlug }).catch((err) =>
    res.status(500).json({ ok: false, message: err.message })
  )

  return res.status(200).json({ ok: true, repos })
})

// given a team slug, list all members for that github team
// prerequisite: the teamSlug must belong to a team from Deck's database
githubTeam.get("/list-members", async (req, res) => {
  const { apiKey, organization, email } = req
  let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err }))
  const { teamSlug } = req.query
  if (!admin.teams) return res.status(404).json({ ok: false, message: "No team found" })

  const members = await listAllTeamMembers({ apiKey, organization, teamSlug }).catch((error) => {
    console.error(error)
    next(error)
  })

  return res.status(200).json({ ok: true, members })
})

// delete a team & remove all members from it
githubTeam.delete("/delete", async (req, res) => {
  const { apiKey, organization } = req
  const { teamSlug } = req.body

  let deleteTeamError
  await deleteTeam({ apiKey, organization, teamSlug }).catch((error) => {
    console.log(error)
    deleteTeamError = error
  })

  return deleteTeamError
    ? res.status(500).json({ ok: false, error: JSON.stringify(deleteTeamError) })
    : res.status(200).json({ ok: true })
})

// create a new team
githubTeam.post("/create", async (req, res) => {
  const { apiKey, organization } = req
  // team name can contain whitespaces
  const { team } = req.body
  let createTeamError
  const newTeam = await createTeam({ apiKey, organization, teamName: team }).catch((error) => {
    console.error(error)
    createTeamError = error
  })

  return createTeamError
    ? res.status(500).json({ ok: false, error: createTeamError })
    : res.status(200).json({ ok: true, team: newTeam })
})

// invite a member to a team
githubTeam.post("/invite-member", async (req, res, next) => {
  const { apiKey, organization } = req
  const { teamSlug, member } = req.body

  await inviteMemberToTeam({ apiKey, organization, teamSlug, member }).catch((error) => {
    console.error(error)
    next(error)
  })

  return res.status(200).json({ ok: true, message: `Successfully invited ${member} to ${teamSlug}` })
})

// remove members from a team
githubTeam.delete("/remove-member", async (req, res, next) => {
  const { apiKey, organization } = req
  const { teamSlug, member } = req.body

  await removeMemberFromTeam({ apiKey, organization, teamSlug, member }).catch((error) => {
    console.error(error)
    next(error)
  })

  return res.status(200).json({ ok: true, message: `Successfully remove ${member} from ${teamSlug}` })
})

module.exports = githubTeam
