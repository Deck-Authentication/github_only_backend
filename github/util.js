// Helper functions for github api calls
const { Octokit } = require("octokit")

// These function won't handle the case where the parameters are not provided or are empty strings
// Those edge cases will be handled by the calling function

// Returns a list of all the teams in the organization
async function listAllTeams({ apiKey, organization }) {
  const octokit = new Octokit({ auth: apiKey })

  const teams = await octokit
    .request("GET /orgs/{org}/teams", { org: organization })
    .then((res) => {
      if (res.status !== 200) throw new Error(res.data.message)
      return res.data
    })
    .catch((err) => {
      console.log(err)
      // throw an error for the caller of this function to handle
      throw new Error(err.message)
    })

  return teams
}

async function listAllTeamRepos({ apiKey, organization, teamSlug }) {
  const octokit = new Octokit({ auth: apiKey })

  const repos = await octokit
    .request("GET /orgs/{org}/teams/{team_slug}/repos", { org: organization, team_slug: teamSlug })
    .then((res) => {
      if (res.status !== 200) throw new Error(res.data.message)
      return res.data
    })
    .catch((err) => {
      console.log(err)
      // throw an error for the caller of this function to handle
      throw new Error(err.message)
    })

  return repos
}

async function listAllTeamMembers({ apiKey, organization, teamSlug }) {
  const octokit = new Octokit({ auth: apiKey })

  const members = await octokit
    .request("GET /orgs/{org}/teams/{team_slug}/members", { org: organization, team_slug: teamSlug })
    .then((res) => {
      if (res.status !== 200) throw new Error(res.data.message)
      return res.data
    })
    .catch((err) => {
      console.log(err)
      // throw an error for the caller of this function to handle
      throw new Error(err.message)
    })

  return members
}

// similar to listAllTeamMembers, but returns an object of the teamSlug and the list of members
async function listAllTeamMembersWithTeamSlug({ apiKey, organization, teamSlug }) {
  const octokit = new Octokit({ auth: apiKey })

  const members = await octokit
    .request("GET /orgs/{org}/teams/{team_slug}/members", { org: organization, team_slug: teamSlug })
    .then((res) => {
      if (res.status !== 200) throw new Error(res.data.message)
      return res.data
    })
    .catch((err) => {
      console.log(err)
      // throw an error for the caller of this function to handle
      throw new Error(err.message)
    })

  return { members, teamSlug }
}

async function listAllOrgMembers({ apiKey, organization }) {
  const octokit = new Octokit({ auth: apiKey })

  const members = await octokit
    .request("GET /orgs/{org}/members", { org: organization })
    .then((res) => {
      if (res.status !== 200) throw new Error(res.data.message)
      return res.data
    })
    .catch((err) => {
      console.log(err)
      // throw an error for the caller of this function to handle
      throw new Error(err.message)
    })

  return members
}

// list all activities for a github organization
// by default, show 30 recent activities per page
async function listOrgActivities({ apiKey, organization, perPage = 30 }) {
  const octokit = new Octokit({ auth: apiKey })

  const activities = await octokit
    .request("GET /orgs/{org}/audit-log", {
      org: organization,
      per_page: perPage,
    })
    .then((res) => {
      if (res.status !== 200) throw new Error(res.data.message)
      return res.data
    })
    .catch((err) => {
      console.log(err)
      // throw an error for the caller of this function to handle
      throw new Error(err.message)
    })

  return activities
}

async function createTeam({ apiKey, organization, teamName, privacy = "closed", teamDescription = "" }) {
  const octokit = new Octokit({ auth: apiKey })

  const team = await octokit
    .request("POST /orgs/{org}/teams", {
      org: organization,
      name: teamName,
      privacy: privacy,
      description: teamDescription,
    })
    .then((res) => {
      if (res.status !== 201) throw new Error(res.data.message)
      return res.data
    })
    .catch((err) => {
      console.log(err)
      // throw an error for the caller of this function to handle
      throw new Error(err.message)
    })

  return team
}

async function deleteTeam({ apiKey, organization, teamSlug }) {
  const octokit = new Octokit({ auth: apiKey })

  await octokit
    .request("DELETE /orgs/{org}/teams/{team_slug}", {
      org: organization,
      team_slug: teamSlug,
    })
    .then((res) => {
      if (res.status !== 204) throw new Error(res.data)
      return res.data
    })
    .catch((err) => {
      console.log(err)
      // throw an error for the caller of this function to handle
      throw new Error(err)
    })
}

async function inviteMemberToTeam({ apiKey, organization, teamSlug, member }) {
  const octokit = new Octokit({ auth: apiKey })

  await octokit
    .request("PUT /orgs/{org}/teams/{team_slug}/memberships/{username}", {
      org: organization,
      team_slug: teamSlug,
      username: member,
    })
    .then((res) => {
      if (res.status !== 200) throw new Error(res.data)
      return res.data
    })
    .catch((err) => {
      console.log(err)
      // throw an error for the caller of this function to handle
      throw new Error(err)
    })
}

async function removeMemberFromTeam({ apiKey, organization, teamSlug, member }) {
  const octokit = new Octokit({ auth: apiKey })

  await octokit
    .request("DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}", {
      org: organization,
      team_slug: teamSlug,
      username: member,
    })
    .then((res) => {
      if (res.status != 204) throw new Error(res.data)
      return res.data
    })
    .catch((err) => {
      console.log(err)
      // throw an error for the caller of this function to handle
      throw new Error(err)
    })
}

module.exports = {
  listAllTeams,
  listAllTeamRepos,
  listAllTeamMembers,
  listAllTeamMembersWithTeamSlug,
  listAllOrgMembers,
  listOrgActivities,
  createTeam,
  deleteTeam,
  inviteMemberToTeam,
  removeMemberFromTeam,
}
