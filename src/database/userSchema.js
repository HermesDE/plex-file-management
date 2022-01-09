const mongoose = require("mongoose");
const plexConnectionSchema = require("./plexConnectionSchema");
const plexLibrarySchema = require("./plexLibrariesSchema");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  plexUsername: {
    type: String,
  },
  plexId: {
    type: String,
  },
  plexToken: {
    type: String,
  },
  permission: {
    type: Number,
  },
  apiLanguage: {
    type: String,
    default: "en-US",
  },
});

module.exports = mongoose.model("Users", userSchema);
