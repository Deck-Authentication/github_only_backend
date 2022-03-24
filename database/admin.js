const mongoose = require("mongoose")

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  githubSlug: { type: String, required: true },
  // an array of team _id strings
  team: [String],
})

// a github repository which belongs to a certain github team
const githubTeamRepo = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  htmlUrl: {
    type: String,
    required: true,
  },
  roleName: {
    type: String,
    required: true,
  },
})

// for now, let's just do github
const TeamSchema = new mongoose.Schema({
  name: String,
  githubTeam: {
    type: Map,
    of: new mongoose.Schema({
      repositories: [githubTeamRepo],
      htmlUrl: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
        required: true,
      },
      privacy: {
        type: String,
        required: true,
      },
    }),
  },
  // an array of member _id strings
  members: [String],
})

const GithubSchema = new mongoose.Schema({
  apiKey: String,
  organization: String,
})

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    github: {
      type: GithubSchema,
      required: true,
    },
    members: mongoose.Schema.Types.Mixed,
    teams: mongoose.Schema.Types.Mixed,
  },
  { collection: "admins" }
)

const Admin = mongoose.model("Admin", AdminSchema)

module.exports = Admin
