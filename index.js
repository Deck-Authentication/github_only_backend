const express = require("express")
const { connectDB } = require("./database")
const jwt = require("express-jwt")
const jwks = require("jwks-rsa")
const cors = require("cors")
const app = express()
const githubRouter = require("./github")
const memberRouter = require("./member")
const adminRouter = require("./admin")

/* Load the .env file and make the variables available to the rest of the application. */
require("dotenv").config({ path: ".env.local" })

// in production environment, only allow requests from the frontend: https://app.withdeck.com
const corsOptions =
  process.env.ENVIRONMENT === "production"
    ? {
        origin: "https://app.withdeck.com",
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      }
    : {}

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-fh2bo4e4.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "http://localhost:8080",
  issuer: "https://dev-fh2bo4e4.us.auth0.com/",
  algorithms: ["RS256"],
})

const PORT = process.env.PORT || 8080

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require("helmet")())
connectDB.call()

app.get("/", (_, res) => {
  res.status(200).send("Welcome to the Deck API. To learn more or sign up for Deck, visit https://withdeck.com")
})

// Secure the backend auth0 API management,
// also getting the access token with the user email from the frontend
app.use(jwtCheck)

// user must be logged in with their email address to call the backend
app.use((req, res, next) => {
  req.user["https://example.com/email"]
    ? next()
    : res.status(401).json({ ok: false, error: "You must be logged in to access this route." })
})

app.use("/admin", adminRouter)
app.use("/github", githubRouter)
app.use("/member", memberRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
