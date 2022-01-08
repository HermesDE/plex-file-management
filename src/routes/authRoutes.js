const express = require("express");
const router = express.Router();
const User = require("../database/UserSchema");
const bcrypt = require("bcrypt");
const saltRounds = 15;

router.get("/", (req, res) => {
  req.session.isAuth ? res.redirect("/dashboard") : res.redirect("/login");
});

router.get("/login", (req, res) => {
  req.session.isAuth ? res.redirect("/") : res.render("pages/login.ejs");
});
router.post("/login", async (req, res) => {
  let user = await User.findOne();
  let password = req.body.password;

  let compare = await bcrypt.compare(password, user.password);
  if (!compare) {
    return res.json({ error: "Wrong password" });
  }
  req.session.isAuth = true;
  res.redirect("/");
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect("/");
});

module.exports = router;
