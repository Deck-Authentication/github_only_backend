const express = require("express")
const githubRouter = express.Router()
const githubTeamRouter = require("./team")
const axios = require("axios")

// save a Github API key to Deck's database
// the key is a personal access token from a Github user: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
githubRouter.post("/api-key/create", async (req, res) => {
  const { apiKey } = req.body

  if (!apiKey) {
    res.status(400).json({ ok: false, message: "Please provide a Github API key" })
    return
  }

  let data = null
  try {
    data = await axios
      .get(`https://api.github.com/user`, { headers: { Authorization: `Bearer ${apiKey}` } })
      .then((response) => response.data)

    if (!data || !data.login) throw new Error("No user data found")
  } catch (err) {
    console.error(err)
    res.status(400).json({ ok: false, message: err.message })
  }

  res.status(200).json({ ok: true, user: data })
})

githubRouter.use("/team", githubTeamRouter)

module.exports = githubRouter
