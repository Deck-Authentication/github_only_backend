const mongoose = require("mongoose")

// Connect to MongoDB
function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((_) => console.log("MongoDB Connected"))
    .catch((err) => console.warn(err))
}

module.exports = { connectDB }
