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

// for now, let's just do github
const TeamSchema = new mongoose.Schema({
  name: String,
  repositories: [String],
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
    github: GithubSchema,
    members: [MemberSchema],
    teams: [TeamSchema],
  },
  { collection: "admins" }
)

const Admin = mongoose.model("Admin", AdminSchema)

module.exports = Admin
