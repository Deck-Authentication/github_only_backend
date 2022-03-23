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

async function listAllReposForTeam({ apiKey, organization, teamSlug }) {
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

module.exports = {
  listAllTeams,
  listAllReposForTeam,
}
