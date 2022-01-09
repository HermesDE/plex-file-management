const mongoose = require("mongoose");

const plexConnectionSchema = new mongoose.Schema({
  plexHostname: {
    type: String,
    required: true,
  },
  plexPort: {
    type: Number,
  },
  plexSSL: {
    type: Boolean,
    required: true,
  },
  plexUri: {
    type: String,
  },
});

module.exports = plexConnectionSchema;
