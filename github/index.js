const express = require("express")
const githubRouter = express.Router()
const githubTeamRouter = require("./team")
const Admin = require("../database/admin")
const { listAllTeams, listAllOrgMembers, listOrgActivities } = require("./util")

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
  let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err }))

  const { github } = admin
  if (!github || !github.apiKey || !github.organization)
    return res.status(404).json({ ok: false, message: "Error: Github credentials not found" })
  const { apiKey, organization } = github

  // 2. get all teams from the github organization
  const teams = await listAllTeams({ apiKey, organization }).catch((err) => res.status(500).json({ ok: false, message: err }))
  let teamsObj = {}
  teams.map((team) => (teamsObj[team.id] = team))
  // 3. get all users from the github organization
  const members = await listAllOrgMembers({ apiKey, organization }).catch((err) =>
    res.status(500).json({ ok: false, message: err })
  )

  let membersObj = {}
  members.map((member) => (membersObj[member.id] = member))

  // 4. save all teams to Deck's database
  admin.teams = teamsObj
  // 5. save all users to Deck's database
  admin.members = membersObj
  await admin.save().catch((err) => res.status(500).json({ ok: false, message: err }))

  return res.status(200).json({ ok: true, message: "Successfully imported all data from Github" })
})

// Every API call to Github need the credentials, so we'll fetch & pass them to subsequent routes through req.
githubRouter.use(async function getCredentials(req, res, next) {
  // 1. get Github's apiKey and organization from Deck's database
  const email = req.user["https://example.com/email"]
  let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err }))

  const { github } = admin
  if (!github || !github.apiKey || !github.organization)
    return res.status(404).json({ ok: false, message: "Error: Github credentials not found" })
  const { apiKey, organization } = github

  req.apiKey = apiKey
  req.organization = organization
  req.email = email

  next()
})

// list all members of an organization on Github
githubRouter.get("/list-members", async (req, res) => {
  // 1. get Github's apiKey and organization from the request
  const { apiKey, organization, email } = req
  // 2. get all users from the github organization
  let listOrgMembersErr
  const members = await listAllOrgMembers({ apiKey, organization }).catch((err) => (listOrgMembersErr = err))

  return listOrgMembersErr ? res.status(500).json({ ok: false, message: err }) : res.status(200).json({ ok: true, members })
})

// list all activities in a Github organization
githubRouter.get("/list-activities", async (req, res) => {
  // 1. get Github's apiKey and organization from the request
  const { apiKey, organization } = req
  const { perPage } = req.query

  // 2. get all activities in the github organization
  let activitiesFetchError = null
  const activities = await listOrgActivities({ apiKey, organization, perPage }).catch((err) => {
    activitiesFetchError = err
  })

  return activitiesFetchError
    ? res.status(500).json({ ok: false, message: activitiesFetchError })
    : res.status(200).json({ ok: true, activities })
})

githubRouter.use("/team", githubTeamRouter)

module.exports = githubRouter
