const adminRouter = require("express").Router()
const Admin = require("../database/admin")

// get all data for the admin from the database
adminRouter.get("/get-all-data", async (req, res) => {
  const email = req.user["https://example.com/email"]

  let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err }))

  return res.status(200).json({ ok: true, admin })
})

adminRouter.put("/set-email", async (req, res) => {
  const { email } = req.body
  const oldEmail = req.user["https://example.com/email"]
  await Admin.findOneAndUpdate({ email: oldEmail }, { email }).catch((err) => res.status(500).json({ ok: false, err }))
  res.status(200).json({ ok: true, message: "Admin email updated" })
})

module.exports = adminRouter
