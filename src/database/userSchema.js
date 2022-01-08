const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "en-US",
  },
  apikey: {
    type: String,
  },
});

module.exports = mongoose.model("Users", userSchema);
