const mongoose = require("mongoose");

const directorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("Directory", directorySchema);
