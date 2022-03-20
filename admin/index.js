const adminRouter = require("express").Router()
const Admin = require("../database/admin")

// adminRouter.use((req, res, next) => {
//   req.session.email ? next() : res.status(401).json({ ok: false, error: "You must be logged in to access this route." })
// })

// get all data for the admin from the database
adminRouter.get("/get-all-data", async (req, res) => {
  const email = req.user["https://example.com/email"]

  if (!email) return res.status(400).json({ ok: false, error: "Unauthorized: No user email found." })

  let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err }))
  if (!admin) {
    // if the user logs in for the first time, create a collection with the email field as provided by auth0
    Admin.create({ email: email }, (err, newAdmin) => {
      if (err) return res.status(500).json({ ok: false, message: err })
      admin = newAdmin

      res.status(200).json({ ok: true, admin: admin })
    })

    return
  }

  return res.status(200).json({ ok: true, admin: admin })
})

adminRouter.put("/set-email", async (req, res) => {
  const { email } = req.body
  await Admin.findOneAndUpdate({ email: req.session.email }, { email }).catch((err) => res.status(500).json({ ok: false, err }))
  res.status(200).json({ ok: true, message: "Admin email updated" })
})

module.exports = adminRouter
