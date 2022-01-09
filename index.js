require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const helmet = require("helmet");
const port = process.env.PORT;
const cookieParser = require("cookie-parser");
const { session } = require("./src/database/database");
const { mongoSessionStore } = require("./src/database/database");

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'"],
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(cookieParser());
const oneMonth = 1000 * 60 * 60 * 24 * 30;
app.use(
  session({
    key: "sessionId",
    secret: process.env.COOKIE_SECRET,
    store: mongoSessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneMonth },
  })
);

app.use("/api/*", (req, res, next) => {
  if (req.session.plexUser) {
    return next();
  } else {
    return res.send("Unauthorized Request").status(403);
  }
});

function ensureAuthentication(req, res, next) {
  if (req.session.plexUser) {
    return next();
  } else {
    res.redirect("/login");
  }
}

app.use(require("./src/routes/api"));
app.use(require("./src/routes/authRoutes"));
app.use(ensureAuthentication, require("./src/routes/routes"));

//fetch non existing routes and respond with 404
app.use(function (req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.render("pages/error/error404");
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.json({ error: "Not found" });
    return;
  }
});

app.listen(port, () => console.log(`Anwendung läuft auf Port ${port}`));
