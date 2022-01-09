const express = require("express");
const router = express.Router();
const User = require("../database/UserSchema");
const plexLogin = require("login-with-plex");

const plexLoginInstance = new plexLogin.PlexLogin({
  appName: "plex-file-management",
  clientId: process.env.UUID,
  forwardUrl: "http://localhost:3000/plex-login-redirect",
});

router.get("/", (req, res) => {
  req.session.plexUser ? res.redirect("/dashboard") : res.render("pages/login");
});

router.get("/login", (req, res) => {
  req.session.plexUser ? res.redirect("/dashboard") : res.render("pages/login");
});
router.get("/plex-login", async (req, res) => {
  //opens login with plex windows
  const credentials = await plexLoginInstance.generateCredentials();
  req.session.plexCredentials = credentials;
  res.redirect(plexLoginInstance.getLoginUrl(credentials));
});
router.get("/plex-login-redirect", async (req, res) => {
  //get info from plex user
  const credentials = req.session.plexCredentials;
  const plexUserInfo = await plexLoginInstance.getUserInfo(credentials);

  //check if this user exists
  const user = await User.findOne({ plexId: plexUserInfo.id });
  if (user) {
    //update plexToken if a new one is available
    if (user.plexToken !== plexUserInfo.authToken) {
      user.plexToken = plexUserInfo.authToken;
    }
    await user.save();

    req.session.plexUser = plexUserInfo;
    delete req.session.plexCredentials;
    res.redirect("/dashboard");
  } else {
    //check if a user already exists. if not create the user
    const totalUsers = await User.countDocuments({ collection: "users" });
    if (totalUsers === 0) {
      let newUser = new User({
        email: plexUserInfo.email,
        plexUsername: plexUserInfo.username,
        plexId: plexUserInfo.id,
        plexToken: plexUserInfo.authToken,
      });
      await newUser.save();

      req.session.plexUser = plexUserInfo;
      delete req.session.plexCredentials;
      res.redirect("/dashboard");
    } else {
      res.send("You are not allowed to login to this server").status(403);
    }
  }
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect("/");
});

module.exports = router;
