const mongoose = require("mongoose");
const session = require("express-session");
let MongoDBStore = require("connect-mongodb-session")(session);

let mongoSessionStore = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: "sessions",
});

main()
  .then(() => {
    console.log("Datenbank verbunden");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

module.exports = { session, mongoSessionStore };
