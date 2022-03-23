// Helper functions for github api calls
const { Octokit } = require("octokit")

export async function listAllTeams({ apiKey, organization }) {
  const octokit = new Octokit({
    auth: apiKey,
  })

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
