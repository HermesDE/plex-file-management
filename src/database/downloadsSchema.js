const mongoose = require("mongoose");

const downloadsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Downloads", downloadsSchema);
